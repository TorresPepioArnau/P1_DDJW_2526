const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    selectedCards: [],
    score: 200,
    groupSize: 2,
    groupsLeft: 0,
    
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
select: function(){
        if (sessionStorage.load){ 
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.selectedCards = toLoad.selectedCards || [];
            this.score = toLoad.score;
            this.groupsLeft = toLoad.groupsLeft;
            this.groupSize = toLoad.groupSize || 2;
        }
        else{ 
            let savedOptions = localStorage.options ? JSON.parse(localStorage.options) : {};
            
            this.groupSize = savedOptions.groupSize || 2;
            let numCards = savedOptions.numCards || 4; 
            let difficulty = savedOptions.difficulty || 'normal';

            if (difficulty === 'easy') this.score = 500;
            else if (difficulty === 'hard') this.score = 100;
            else this.score = 200; // normal

            this.items = resources.slice();          
            shuffe(this.items);                      
            this.items = this.items.slice(0, numCards); 
            
            let gameBoard = [];
            for (let i = 0; i < this.groupSize; i++) {
                gameBoard = gameBoard.concat(this.items);
            }
            this.items = gameBoard;
            
            shuffe(this.items);
            this.states = new Array(this.items.length).fill(StateCard.ENABLE);
            this.groupsLeft = numCards;
        }
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE || this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
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
            
            if (this.groupsLeft <= 0){
                alert(`Has guanyat amb ${this.score} punts!!!!`);
                window.location.assign("../");
            }
        }
		else { 
            this.ready = 0;
            setTimeout(() => {
                this.selectedCards.forEach(idx => this.goBack(idx));
                
                let savedOptions = localStorage.options ? JSON.parse(localStorage.options) : {};
                let penalty = 25;
                if (savedOptions.difficulty === 'hard') penalty = 50;
                else if (savedOptions.difficulty === 'easy') penalty = 10;
                
                this.score -= penalty;
                
                this.selectedCards = [];
                this.ready = this.items.length;
                
                if (this.score <= 0) {
                    alert("Has perdut!");
                    window.location.assign("../");
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
            groupSize: this.groupSize
        });
        localStorage.setItem('save', to_save);
        window.location.assign("../");
    }
}

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