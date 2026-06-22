"use strict";

function initGame(difficulty) {
    gameState.difficulty = difficulty;
    gameState.timeElapsed = 0;
    gameState.lives = 5;
    gameState.selectedCell = null;
    gameState.isPaused = false;
    
    var clues = 0;
    document.body.className = ''; 
    if (difficulty === 'Fácil') {
        clues = getRandomInt(32, 36);
        gameState.baseScore = 2000;
        document.body.classList.add('theme-easy');
    } else if (difficulty === 'Medio') {
        clues = getRandomInt(28, 31);
        gameState.baseScore = 1000;
        document.body.classList.add('theme-medium');
    } else {
        clues = getRandomInt(22, 27);
        gameState.baseScore = 0;
        document.body.classList.add('theme-hard');
    }
    
    gameState.score = gameState.baseScore;

    gameData.solutionMatrix = shuffleSudokuMatrix();
    gameData.maskedMatrix = maskMatrix(gameData.solutionMatrix, clues);
    gameData.userMatrix = deepCopyMatrix(gameData.maskedMatrix);

    updateDashboard();
    renderBoard();
    startTimer();
    
    document.getElementById('board-overlay').classList.add('hidden');
    showScreen('game-screen');
}

function startTimer() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(function() {
        if (!gameState.isPaused) {
            gameState.timeElapsed++;
            document.getElementById('timer-display').innerText = formatTime(gameState.timeElapsed);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(gameState.timerInterval);
}

function renderBoard() {
    var boardContainer = document.getElementById('sudoku-board');
    boardContainer.innerHTML = '';
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            var cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.setAttribute('data-row', r);
            cell.setAttribute('data-col', c);
            
            var val = gameData.userMatrix[r][c];
            var isClue = gameData.maskedMatrix[r][c] !== 0;
            
            if (isClue) {
                cell.innerText = val;
                cell.classList.add('clue');
            } else if (val !== 0) {
                cell.innerText = val;
                if (val !== gameData.solutionMatrix[r][c]) {
                    cell.classList.add('error');
                }
            }
            
            cell.addEventListener('click', onCellClick);
            boardContainer.appendChild(cell);
        }
    }
}

function onCellClick(e) {
    if (gameState.isPaused) return;
    var target = e.target;
    if (target.classList.contains('clue')) return;
    
    var cells = document.querySelectorAll('.sudoku-cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove('selected');
    }
    
    target.classList.add('selected');
    gameState.selectedCell = target;
}

function processNumberInput(num) {
    if (!gameState.selectedCell || gameState.isPaused) return;
    
    var r = parseInt(gameState.selectedCell.getAttribute('data-row'), 10);
    var c = parseInt(gameState.selectedCell.getAttribute('data-col'), 10);
    var correctNum = gameData.solutionMatrix[r][c];

    gameData.userMatrix[r][c] = num;
    gameState.selectedCell.innerText = num;

    if (num !== correctNum) {
        gameState.selectedCell.classList.add('error');
        gameState.lives--;
        gameState.score += 300;
        updateDashboard();
        
        if (gameState.lives <= 0) {
            handleGameOver();
        }
    } else {
        gameState.selectedCell.classList.remove('error');
        checkVictory();
    }
}

function handleGameOver() {
    stopTimer();
    gameState.isPaused = true;
    showModal('modal-game-over');
}

function checkVictory() {
    var isComplete = true;
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            if (gameData.userMatrix[r][c] !== gameData.solutionMatrix[r][c]) {
                isComplete = false;
                break;
            }
        }
    }
    
    if (isComplete) {
        stopTimer();
        gameState.isPaused = true;
        gameState.score += gameState.timeElapsed; 
        document.getElementById('victory-score').innerText = gameState.score;
        saveScore();
        showModal('modal-victory');
    }
}