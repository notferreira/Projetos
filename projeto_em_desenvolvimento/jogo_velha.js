// --- SELEÇÃO DE ELEMENTOS DO HTML ---
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart-button');
const modeSelectionScreen = document.getElementById('mode-selection');
const gameContainer = document.getElementById('game-container');
const vsPlayerBtn = document.getElementById('vsPlayerBtn');
const vsAIBtn = document.getElementById('vsAIBtn');
const changeModeButton = document.getElementById('change-mode-button');

// --- VARIÁVEIS DO JOGO ---
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]             // Diagonais
];

let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false; // O jogo começa inativo
let gameMode = ""; // 'vsPlayer' ou 'vsAI'

// --- MENSAGENS DE STATUS ---
const winMessage = () => {
    const playerName = (gameMode === 'vsAI' && currentPlayer === 'O') ? 'Máquina' : (currentPlayer === 'X' ? 'Sol' : 'Lua');
    return `O jogador ${playerName} venceu!`;
};
const drawMessage = () => `O jogo empatou!`;
const currentPlayerTurn = () => {
    if (gameMode === 'vsAI' && currentPlayer === 'O') {
        return "Vez da Máquina...";
    }
    return currentPlayer === 'X' ? 'É a vez do Sol' : 'É a vez da Lua';
};

// --- FUNÇÕES PRINCIPAIS ---

// Inicia o jogo com o modo escolhido
function startGame(selectedMode) {
    gameMode = selectedMode;
    gameActive = true;
    modeSelectionScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    statusText.textContent = currentPlayerTurn();
}

// Lida com o clique humano em uma célula
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[clickedCellIndex] !== "" || !gameActive || (gameMode === 'vsAI' && currentPlayer === 'O')) {
        return; // Ignora o clique se a célula estiver ocupada, jogo inativo ou for a vez da IA
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();

    // Se for modo vs IA e o jogo ainda estiver ativo, chama a jogada da IA
    if (gameActive && gameMode === 'vsAI' && currentPlayer === 'O') {
        disableBoard(); // Desabilita o tabuleiro enquanto a IA "pensa"
        setTimeout(aiMove, 1000); // Espera 1 segundo para a IA jogar
    }
}

// A "Inteligência" da Máquina
function aiMove() {
    // 1. Encontrar todas as células vazias
    const availableCellsIndexes = [];
    boardState.forEach((cell, index) => {
        if (cell === "") {
            availableCellsIndexes.push(index);
        }
    });

    // 2. Escolher uma célula vazia aleatoriamente
    const randomIndex = Math.floor(Math.random() * availableCellsIndexes.length);
    const chosenCellIndex = availableCellsIndexes[randomIndex];
    const chosenCell = document.querySelector(`.cell[data-index='${chosenCellIndex}']`);

    // 3. Fazer a jogada
    updateCell(chosenCell, chosenCellIndex);
    checkResult();
    enableBoard(); // Reabilita o tabuleiro para o jogador
}

// --- FUNÇÕES AUXILIARES ---

function updateCell(cell, index) {
    boardState[index] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = currentPlayerTurn();
}

function checkResult() {
    let roundWon = false;
    for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = winMessage();
        gameActive = false;
        return;
    }

    if (!boardState.includes("")) {
        statusText.textContent = drawMessage();
        gameActive = false;
        return;
    }

    changePlayer();
}

function restartGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = currentPlayerTurn();
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
    });
    enableBoard();
}

function backToModeSelection() {
    gameContainer.classList.add('hidden');
    modeSelectionScreen.classList.remove('hidden');
    restartGame(); // Reseta o estado do jogo ao voltar
    gameActive = false;
}

function disableBoard() {
    cells.forEach(cell => cell.style.pointerEvents = 'none');
}

function enableBoard() {
    cells.forEach(cell => cell.style.pointerEvents = 'auto');
}


// --- EVENT LISTENERS ---
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
vsPlayerBtn.addEventListener('click', () => startGame('vsPlayer'));
vsAIBtn.addEventListener('click', () => startGame('vsAI'));
changeModeButton.addEventListener('click', backToModeSelection);