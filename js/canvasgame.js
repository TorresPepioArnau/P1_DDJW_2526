import {$} from "../library/jquery-4.0.0.slim.module.min.js";
import {clickCard, gameItems, selectCards, startGame, initCard, saveGame} from "./memory.js";

let game = $('#game');
let canvas = game[0].getContext('2d');
let resources = {};
let cards = {};
const e_click = {click: false, x: -1, y: -1}
let key = null;
const c_w = 96;
const c_h = 128;
let idxSel = -1;

if (canvas){
    game.attr("width", 800);
    game.attr("height", 600);
    start();
    update();
}

function start() {
    selectCards();
    
    if (!gameItems || gameItems.length === 0) {
        setTimeout(start, 100);
        return;
    }

    const cardsPerRow = 6;
    const gap = 20;

    cards = gameItems.map((texturePath, indx) => {

        const col = indx % cardsPerRow;
        const row = Math.floor(indx / cardsPerRow);

        const cardObj = { 
            texture: texturePath,
            position: {
                xMin: 50 + col * (c_w + gap),
                xMax: 50 + col * (c_w + gap) + c_w,
                yMin: 50 + row * (c_h + gap),
                yMax: 50 + row * (c_h + gap) + c_h
            }
        };
        initCard(newTexture => {
            cardObj.texture = newTexture;
        });

        cardObj.onClick = function(x, y) {
            return x >= this.position.xMin && x <= this.position.xMax &&
                   y >= this.position.yMin && y <= this.position.yMax;
        };

        return cardObj;
    });

    game.off('click').on('click', function(e) {
        e_click.click = true;
        e_click.x = e.pageX - this.offsetLeft;
        e_click.y = e.pageY - this.offsetTop;
    });

    $(document).off('keydown').on('keydown', e => key = e.key);

    startGame();
}

function update(){
    checkInput();
    draw();
    requestAnimationFrame(update);
}

function loadCardResource(src){
    if (!resources[src]){
        let res = {image: null, ready: false}
        res.image = new Image();
        res.image.src = src;
        res.image.onload = ()=> res.ready = true;
        resources[src] = res;
    }
}

function draw() {
    canvas.clearRect(0, 0, 800, 600);
    
    cards.forEach((card, indx) => {
        const x = card.position.xMin;
        const y = card.position.yMin;

        if (card.texture === '../resources/back.svg' || card.texture === 'back') {
            drawBackProgrammed(canvas, x, y, c_w, c_h);
        } else {
            drawCardFront(canvas, x, y, c_w, c_h, card.texture);
        }

        if (idxSel === indx) {
            canvas.strokeStyle = "#55883B"; 
            canvas.lineWidth = 4;
            canvas.strokeRect(x - 2, y - 2, c_w + 4, c_h + 4);
        }
    });
}

function checkInput(){
    if (e_click.click){
        cards.some((card, indx)=>{
            let click = card.onClick(e_click.x, e_click.y);
            if (click) clickCard(indx);
            return click;
        });
    }
    if (key){
        let prevIndx = idxSel;
        switch(key){
            case "Escape":
                saveGame();
                break;
            case "ArrowRight":
                idxSel = (idxSel + 1)%cards.length;
                break;
            case "ArrowLeft":
                idxSel = (idxSel - 1 + cards.length)%cards.length;
                break;
            case "Enter":
                if (idxSel >= 0) clickCard(idxSel);
                break;
            default:
                console.warn("Tecla "+key+" no reconeguda.");
        }
        if (idxSel != prevIndx){
            if (prevIndx >= 0) {
                cards[prevIndx].position.xMin += 2;
            }
            cards[idxSel].position.xMin -= 2;
        }
    }
    e_click.click = key = false;
}

function drawBackProgrammed(ctx, x, y, w, h) {
    const rx = 10;
    
    ctx.save();
    ctx.fillStyle = "#154F15";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rx);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.moveTo(x + w/2, y + 10);
    ctx.lineTo(x + w - 10, y + h/2);
    ctx.lineTo(x + w/2, y + h - 10);
    ctx.lineTo(x + 10, y + h/2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#1e6b1e";
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h/2, w/4, h/3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();

    ctx.arc(x + w/2, y + h/2 - 10, 15, Math.PI * 0.8, Math.PI * 2.2);
    ctx.lineTo(x + w/2, y + h/2 + 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + w/2, y + h/2 + 35, 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}

function drawCardFront(ctx, x, y, w, h, texture) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = "#FFFFFF"; 
    ctx.strokeStyle = "#9A6735"; 
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 10);
    ctx.fill();
    ctx.stroke();

    ctx.translate(w / 2, h / 2);
    
    if (texture.includes('cb.png')) { // Cercle Blau
        ctx.fillStyle = "#0000FF";
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.fill();
    } 
    else if (texture.includes('co.png')) { // Cercle Taronja
        ctx.fillStyle = "#FF8C00";
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.fill();
    }
    else if (texture.includes('sb.png')) { // Quadrat Blau 
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(-30, -30, 60, 60);
    }
    else if (texture.includes('so.png')) { // Quadrat Taronja
        ctx.fillStyle = "#FF8C00";
        ctx.fillRect(-30, -30, 60, 60);
    }
    else if (texture.includes('tb.png')) { // Triangle Blau
        ctx.fillStyle = "#0000FF";
        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.lineTo(35, 30);
        ctx.lineTo(-35, 30);
        ctx.closePath();
        ctx.fill();
    }
    else if (texture.includes('to.png')) { // Triangle Taronja
        ctx.fillStyle = "#FF8C00";
        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.lineTo(35, 30);
        ctx.lineTo(-35, 30);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}