const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

const StateCard = Object.freeze({
    DISABLE: 0,
    ENABLE: 1,
    DONE: 2
});

}
function updateRanking(finalLevel) {
    let alies = sessionStorage.getItem('alies') || "Desconegut";
    let ranking = localStorage.getItem('ranking_mode2') ? JSON.parse(localStorage.getItem('ranking_mode2')) : [];
    ranking.push({ name: alies, level: finalLevel });
    ranking.sort((a, b) => b.level - a.level);
    localStorage.setItem('ranking_mode2', JSON.stringify(ranking.slice(0, 10)));
}

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    selectedCards: [],
    score: 200,
    groupSize: 2,
    groupsLeft: 0,
    mode: 1,
    currentLevel: 1,
    penalty: 25,

    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    updateScore: function() {
        const el = document.getElementById('puntuacio_display');
        if (el) el.innerText = "Punts: " + this.score;
    },

    generateProgressiveLevel: function() {
        let numCards = 2 + Math.floor(this.currentLevel / 2);
        if (numCards > resources.length) numCards = resources.length;

        this.groupSize = 2 + Math.floor(this.currentLevel / 4);
        this.penalty = 10 + (this.currentLevel * 5);

        this.items = resources.slice(0, numCards);
        let gameBoard = [];
        for (let i = 0; i < this.groupSize; i++) {
            gameBoard = gameBoard.concat(this.items);
        }
        this.items = gameBoard;
        shuffe(this.items);
        
        this.states = new Array(this.items.length).fill(StateCard.ENABLE);
        this.groupsLeft = numCards;
    },

	checkWin: function() {
        if (this.groupsLeft <= 0) {
            if (this.mode === 1) {
                alert(`Has guanyat amb ${this.score} punts!!!!`);
                window.location.assign("../");
            } else {
                alert(`Nivell ${this.currentLevel} superat!`);
                
                let proxiNivell = parseInt(this.currentLevel) + 1;
                
                sessionStorage.setItem('currentLevel', proxiNivell);
                sessionStorage.setItem('accumulatedScore', this.score); 
                
                location.reload(); 
            }
        }
    },

select: function(){
    let loadData = sessionStorage.getItem('load');

    if (loadData){ 
        let toLoad = JSON.parse(loadData);
        console.log("Dades carregades:", toLoad); 

        this.items = toLoad.items;
        this.states = toLoad.states;
        this.selectedCards = toLoad.selectedCards || [];
        this.score = toLoad.score;
        this.groupsLeft = toLoad.groupsLeft;
        this.groupSize = toLoad.groupSize || 2;
        this.mode = toLoad.mode || 1;
        this.currentLevel = toLoad.currentLevel || 1;

        if (this.mode === 2) {
            this.penalty = 10 + (this.currentLevel * 5);
        } else {
            let savedOptions = localStorage.options ? JSON.parse(localStorage.options) : {};
            let difficulty = savedOptions.difficulty || 'normal';
            if (difficulty === 'easy') this.penalty = 10;
            else if (difficulty === 'hard') this.penalty = 50;
            else this.penalty = 25;
        }

        sessionStorage.removeItem('load');

    }
    else { 
        this.mode = parseInt(sessionStorage.getItem('gameMode')) || 1;
        
        if (this.mode === 1) {
            let savedOptions = localStorage.options ? JSON.parse(localStorage.options) : {};
            this.groupSize = savedOptions.groupSize || 2;
            let numCards = savedOptions.numCards || 4; 
            let difficulty = savedOptions.difficulty || 'normal';

            if (difficulty === 'easy') { this.score = 500; this.penalty = 10; }
            else if (difficulty === 'hard') { this.score = 100; this.penalty = 50; }
            else { this.score = 200; this.penalty = 25; }

            this.items = resources.slice(0, numCards);          
            let gameBoard = [];
            for (let i = 0; i < this.groupSize; i++) {
                gameBoard = gameBoard.concat(this.items);
            }
            this.items = gameBoard;
            shuffe(this.items);
            this.states = new Array(this.items.length).fill(StateCard.ENABLE);
            this.groupsLeft = numCards;
        } else {
            // Mode progressiu: llegim el nivell que checkWin ha guardat
            this.currentLevel = parseInt(sessionStorage.getItem('currentLevel')) || 1;
            let accumulated = sessionStorage.getItem('accumulatedScore');
            this.score = accumulated ? parseInt(accumulated) : 300;
            this.generateProgressiveLevel();
        }
    }
    this.updateScore();
},

    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE || this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                // Temps escalable segons nivell
                let wait = Math.max(200, 1000 - (this.currentLevel * 150));
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, wait + 100 * indx);
            }
        });
    },

    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        
        this.goFront(indx);
        this.selectedCards.push(indx);

        if (this.selectedCards.length < this.groupSize) return;

        let allMatch = this.selectedCards.every(val => this.items[val] === this.items[this.selectedCards[0]]);

        if (allMatch) {
            this.selectedCards.forEach(idx => this.states[idx] = StateCard.DONE);
            this.groupsLeft--;
            this.selectedCards = [];
            this.checkWin();
        }
        else { 
            this.ready = 0;
            setTimeout(() => {
                this.selectedCards.forEach(idx => this.goBack(idx));
                this.score -= this.penalty;
                this.updateScore();
                
                this.selectedCards = [];
                this.ready = this.items.length;
                
                if (this.score <= 0) {
					alert("Joc acabat!");
					if (this.mode === 2) {
						updateRanking(this.currentLevel); 
					}
					window.location.assign("../");
					sessionStorage.removeItem('currentLevel');
					sessionStorage.removeItem('accumulatedScore');
}
            }, 700);
        }
    },

    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            selectedCards: this.selectedCards,
            score: this.score,
            groupsLeft: this.groupsLeft,
            groupSize: this.groupSize,
            mode: this.mode,
            currentLevel: this.currentLevel
        });
        localStorage.setItem('save', to_save);
        window.location.assign("../");
    }
};

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { game.select(); gameItems = game.items; }
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}
export function saveGame(){ game.save(); }