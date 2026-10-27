import Ship from "./Ship.js";

const SIZE = 40;              
const COLS = 8;                
const ROWS = 11;               
const POINTS_PER_KILL = 100;   
const SPEED_UP_SCORE = 1000;   
const WIN_SCORE = 5000;        
const TIME_STEP = 150;         
const MAX_SPEED = 8;           
const ENEMY_ROWS = 4;          
const COLORS = ["hotpink", "mediumpurple"];

const BOARD_SIZE = {
    width: COLS * SIZE,
    height: ROWS * SIZE
};

const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const speedSelect = document.getElementById("speedSelect");
const startBtn = document.getElementById("startBtn");

board.style.width = BOARD_SIZE.width + "px";
board.style.height = BOARD_SIZE.height + "px";

let warrior = null;
let enemies = [];
let score = 0;
let speed = 1;
let timer = null;
let running = false;

function getDelay() {
    return TIME_STEP * (MAX_SPEED + 1 - speed);
}

function updateInfo() {
    scoreEl.textContent = score;
    speedEl.textContent = speed;
}

startBtn.addEventListener("click", () => {
    try {
        startGame();
    } catch (error) {
        window.alert(error.message);
    }
    startBtn.blur(); 
});

function startGame() {
    const chosen = Number(speedSelect.value);
    if (!(chosen >= 1 && chosen <= MAX_SPEED)) {
        throw new Error("Невірна швидкість!");
    }

    board.innerHTML = "";
    enemies = [];
    score = 0;
    speed = chosen;
    updateInfo();

    warrior = new Ship(0, BOARD_SIZE.height - SIZE, SIZE, "yellow");
    board.appendChild(warrior.id());
    warrior.show();

    createEnemies();

    running = true;
    startBtn.disabled = true;
    clearInterval(timer);
    timer = setInterval(moveEnemies, getDelay());
}

function createEnemies() {
    for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const color = COLORS[(row + col) % COLORS.length];
            const enemy = new Ship(col * SIZE, row * SIZE, SIZE, color);
            board.appendChild(enemy.id());
            enemy.show();
            enemies.push(enemy);
        }
    }
}

function moveEnemies() {
    for (const enemy of enemies) {
        enemy.move(0, SIZE);
    }
    for (const enemy of enemies) {
        if (enemy.y() >= warrior.y()) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    running = false;
    clearInterval(timer);
    startBtn.disabled = false;
    window.alert("HAHAHA you LOST!!! Score: " + score);
}

function gameWin() {
    running = false;
    clearInterval(timer);
    startBtn.disabled = false;
    window.alert("Victory! You're a real champ! Score: " + score);
}

window.addEventListener("keydown", (e) => {
    if (!running) {
        return;
    }
    switch (e.key) {
        case "ArrowLeft": {
            if (warrior.x() - SIZE < 0) {
                return;
            }
            warrior.move(-SIZE, 0);
            break;
        }
        case "ArrowRight": {
            if (warrior.x() + SIZE >= BOARD_SIZE.width) {
                return;
            }
            warrior.move(SIZE, 0);
            break;
        }
        case " ": {
            e.preventDefault(); 
            shoot();
            break;
        }
    }
});

function shoot() {
    let target = null;
    for (const enemy of enemies) {
        if (enemy.x() === warrior.x()) {
            if (target === null || enemy.y() > target.y()) {
                target = enemy;
            }
        }
    }

    const top = target ? target.y() + SIZE : 0;
    const beam = document.createElement("div");
    beam.style = `position: absolute; left: ${warrior.x() + SIZE / 2 - 2}px; top: ${top}px; width: 4px; height: ${warrior.y() - top}px; background-color: lime;`;
    board.appendChild(beam);
    setTimeout(() => beam.remove(), 150);

    if (target === null) {
        return;
    }

    target.destroy();
    enemies.splice(enemies.indexOf(target), 1);
    score += POINTS_PER_KILL;

    if (score % SPEED_UP_SCORE === 0 && speed < MAX_SPEED) {
        speed++;
        clearInterval(timer);
        timer = setInterval(moveEnemies, getDelay());
    }
    updateInfo();

    if (score >= WIN_SCORE) {
        gameWin();
        return;
    }

    if (enemies.length === 0) {
        createEnemies();
    }
}