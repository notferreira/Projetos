const canvas = document.getElementById('game');
const ctx = canvas.getContext("2d");
const pauseBtn = document.getElementById('pauseBtn');
// CORRIGIDO: Referência correta ao elemento da lista de recordes
const highScoresList = document.getElementById('highScoresList'); 
const HIGH_SCORES_KEY = 'snakeHighScores'; // CORRIGIDO: "snake" em vez de "sanake"

const box = 20;
const canvasSize = 20;
const MAX_SCORES = 5;

let lastUpdateTime = 0;
let gamePace = 135;
let isPaused = false;
let snake, food, direction, pontuacao, gameOver, jogoIniciado;
let directionQueue = [];

function drawRoundedRect(x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

function drawGrid() {
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#026d00ff' : '#0dbf00ff';
            ctx.fillRect(x * box, y * box, box, box);
        }
    }
}

function loadHighScores() {
    const scoresJSON = localStorage.getItem(HIGH_SCORES_KEY);
    return scoresJSON ? JSON.parse(scoresJSON) : [];
}

function displayHighScores() {
    const highScores = loadHighScores();
    // Previne erro se o highScoresList não for encontrado
    if (highScoresList) {
        highScoresList.innerHTML = highScores 
            .map(score => `<li><span>${score.name}</span><span>${score.score}</span></li>`)
            .join('');
    }
}

// ADICIONADO: A função que estava faltando para salvar os scores
function saveHighScores(scores) {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
}

function checkAndAddHighScore(score) {
    if (score === 0) return;

    const highScores = loadHighScores();
    const lowestScore = highScores[MAX_SCORES - 1]?.score ?? 0;

    if (score > lowestScore || highScores.length < MAX_SCORES) {
        const name = prompt('Novo Recorde! Digite suas iniciais (3 letras):');
        const newScore = { score, name: name ? name.substring(0, 3).toUpperCase() : '???' };
        
        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score);
        const newHighScores = highScores.slice(0, MAX_SCORES);
        
        saveHighScores(newHighScores);
        displayHighScores();
    }
}

function initGame() {
    isPaused = false;
    pauseBtn.textContent = 'Pause SPACE';
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = 'RIGHT';
    directionQueue = [];
    food = generateFood();
    pontuacao = 0;
    gamePace = 135;
    document.getElementById('pontuacao').textContent = 'Pontuação: 0';
    gameOver = false;
    jogoIniciado = false;
    lastUpdateTime = 0;
    displayHighScores();
    requestAnimationFrame(gameLoop);
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    } while (isFoodOnSnake(newFood));
    return newFood;
}

function isFoodOnSnake(foodPos) {
    for (let segment of snake) {
        if (segment.x === foodPos.x && segment.y === foodPos.y) {
            return true;
        }
    }
    return false;
}

function togglePause() {
    if (!jogoIniciado || gameOver) return; 

    isPaused = !isPaused;
    if (isPaused){
        pauseBtn.textContent = 'Resume SPACE'; 
    } else {
        pauseBtn.textContent = 'Pause SPACE'; 
        lastUpdateTime = performance.now();
    }
}

document.addEventListener('keydown', handleKeyPress);
pauseBtn.addEventListener('click', togglePause);

function handleKeyPress(e) {
    if(e.key.toLowerCase() === ' ') {
        togglePause();
        return;
    }

    if (gameOver && e.key === 'Enter') {
        initGame();
        return;
    }

    if (isPaused) return;
    jogoIniciado = true;
    directionQueue.push(e.key);
}

function processInput(){
    const key = directionQueue.shift(); 
    if (!key) return;

    if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && direction !== 'RIGHT') direction = 'LEFT';
    else if ((key === 'ArrowUp' || key === 'w' || key === 'W') && direction !== 'DOWN') direction = 'UP';
    else if ((key === 'ArrowRight' || key === 'd' || key === 'D') && direction !== 'LEFT') direction = 'RIGHT';
    else if ((key === 'ArrowDown' || key === 's' || key === 'S') && direction !== 'UP') direction = 'DOWN';
}

function updateGameLogic() {
    processInput();
    let headX = snake[0].x;
    let headY = snake[0].y;
    if (direction === 'LEFT') headX -= box;
    if (direction === 'RIGHT') headX += box;
    if (direction === 'UP') headY -= box;
    if (direction === 'DOWN') headY += box;

    if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height || checkCollision(headX, headY, snake)) {
        gameOver = true;
        checkAndAddHighScore(pontuacao);
        return;
    }

    if (headX === food.x && headY === food.y) {
        pontuacao++;
        document.getElementById('pontuacao').textContent = 'Pontuação: ' + pontuacao;
        food = generateFood();
        if (pontuacao % 5 === 0 && gamePace > 60) {
            gamePace -= 15;
        }
    } else {
        snake.pop();
    }
    snake.unshift({ x: headX, y: headY });
}

function checkCollision(x, y, array) {
    for (let i = 1; i < array.length; i++) {
        if (x === array[i].x && y === array[i].y) {
            return true;
        }
    }
    return false;
}

function gameLoop(currentTime) {
    if (gameOver) {
        drawGameOver();
        return;
    }
    requestAnimationFrame(gameLoop);
    const elapsed = currentTime - lastUpdateTime;
    if (!isPaused && elapsed > gamePace) {
        lastUpdateTime = currentTime;
        if (jogoIniciado) {
            updateGameLogic();
        }
    }
    drawGrid();
    if (!jogoIniciado) {
        drawInitialScreen();
    } else {
        for (let i = 0; i < snake.length; i++) {
            const color = i === 0 ? '#ffd700' : '#fff';
            drawRoundedRect(snake[i].x, snake[i].y, box, box, 5, color, '#111');
        }
        drawRoundedRect(food.x, food.y, box, box, 8, '#e74c3c', '#8c2d23');
    }
    if (isPaused) {
        drawPausedScreen();
    }
}

function drawInitialScreen() {
    drawGrid();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('Mova para iniciar', canvas.width / 2, canvas.height / 2);
}

function drawPausedScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    ctx.fillStyle = '#ffd700'; 
    ctx.font = '30px "PRESS START 2P"'; 
    ctx.textAlign = 'center'; 
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2); 
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e74c3c';
    ctx.font = '35px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText(`Sua pontuação: ${pontuacao}`, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = '#ffd700';
    ctx.font = '14px "Press Start 2P"';
    ctx.fillText('Pressione Enter', canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText('para reiniciar', canvas.width / 2, canvas.height / 2 + 70);
}

initGame();
