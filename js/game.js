"use strict";

// Inicializa matriz de notas vacía
function createEmptyNotes() {
    var notes = [];
    for (var r = 0; r < 9; r++) {
        var row = [];
        for (var c = 0; c < 9; c++) { row.push([]); }
        notes.push(row);
    }
    return notes;
}

// Guarda estado para función Deshacer
function saveStateToHistory() {
    gameState.history.push({
        userMatrix: deepCopyMatrix(gameData.userMatrix),
        notesMatrix: deepCopyNotes(gameData.notesMatrix),
        lives: gameState.lives,
        score: gameState.score
    });
}

// Deshacer: Al deshacer no se recupera la vida en caso de error del usuario.
function undoLastAction() {
    if (gameState.history.length === 0 || gameState.isPaused) return;
    var lastState = gameState.history.pop();
    
    // Se restaura el tablero y las notas
    gameData.userMatrix = lastState.userMatrix;
    gameData.notesMatrix = lastState.notesMatrix;
    
    // NOTA: No se restauran lastState.lives ni lastState.score para que las penalizaciones por errores sean irreversibles (El contador no se modifica a favor).

    updateDashboard();
    renderBoard();
}

function initGame(difficulty) {
    gameState.difficulty = difficulty;
    gameState.timeElapsed = 0;
    gameState.lives = 5;
    gameState.selectedCell = null;
    gameState.isPaused = false;
    gameState.isNotesMode = false;
    gameState.history = [];
    document.getElementById('btn-notes').classList.remove('active');
    
    var clues = 0;
    document.body.className = ''; 
    
    // PUNTOS: Mayor motivación al nivel fácil y medio
    if (difficulty === 'Fácil') {
        // Cantidad de números prellenados para el nivel fácil
        clues = getRandomInt(45, 50);
        // Puntos base para el nivel fácil
        gameState.baseScore = 5000; 
        // Cambia el tema visual para el nivel fácil
        document.body.classList.add('theme-easy');
    } else if (difficulty === 'Medio') {
        // Cantidad de números prellenados para el nivel medio
        clues = getRandomInt(36, 44);
        // Puntos base para el nivel medio
        gameState.baseScore = 2500;
        // Cambia el tema visual para el nivel medio
        document.body.classList.add('theme-medium');
    } else {
        // Cantidad de números prellenados para el nivel difícil
        clues = getRandomInt(28, 35);
        // Puntos base para el nivel difícil
        gameState.baseScore = 0;
        // Cambia el tema visual para el nivel difícil
        document.body.classList.add('theme-hard');
    }
    
    gameState.score = gameState.baseScore;

    gameData.solutionMatrix = shuffleSudokuMatrix();
    gameData.maskedMatrix = maskMatrix(gameData.solutionMatrix, clues);
    gameData.userMatrix = deepCopyMatrix(gameData.maskedMatrix);
    gameData.notesMatrix = createEmptyNotes();

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
    
    // Distribución Numpad para las notas
    var notesLayoutMap = [7, 8, 9, 4, 5, 6, 1, 2, 3]; 

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
            } else {

                var notes = gameData.notesMatrix[r][c];
                if (notes.length > 0) {
                    var notesContainer = document.createElement('div');
                    notesContainer.className = 'notes-container';
                    
                    for (var i = 0; i < 9; i++) {
                        var noteDiv = document.createElement('div');
                        noteDiv.className = 'note-cell';
                        var mappedNum = notesLayoutMap[i];
                        if (notes.indexOf(mappedNum) !== -1) {
                            noteDiv.innerText = mappedNum;
                        }
                        notesContainer.appendChild(noteDiv);
                    }
                    cell.appendChild(notesContainer);
                }
            }
            
            if (gameState.selectedCell && 
                parseInt(gameState.selectedCell.getAttribute('data-row'), 10) === r && 
                parseInt(gameState.selectedCell.getAttribute('data-col'), 10) === c) {
                cell.classList.add('selected');
                gameState.selectedCell = cell; 
            }
            
            cell.addEventListener('click', onCellClick);
            boardContainer.appendChild(cell);
        }
    }
}

function onCellClick(e) {
    if (gameState.isPaused) return;
    var target = e.currentTarget;
    if (target.classList.contains('clue')) return;
    
    var cells = document.querySelectorAll('.sudoku-cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove('selected');
    }
    
    target.classList.add('selected');
    gameState.selectedCell = target;
}

// Limpia las notas relacionadas cuando se coloca un número final
function clearAdjacentNotes(row, col, num) {
    var r, c;
    // Fila y Columna
    for (var i = 0; i < 9; i++) {
        var idxCol = gameData.notesMatrix[row][i].indexOf(num);
        if (idxCol !== -1) gameData.notesMatrix[row][i].splice(idxCol, 1);
        
        var idxRow = gameData.notesMatrix[i][col].indexOf(num);
        if (idxRow !== -1) gameData.notesMatrix[i][col].splice(idxRow, 1);
    }
    // Bloque 3x3
    var startR = Math.floor(row / 3) * 3;
    var startC = Math.floor(col / 3) * 3;
    for (r = startR; r < startR + 3; r++) {
        for (c = startC; c < startC + 3; c++) {
            var idxBlock = gameData.notesMatrix[r][c].indexOf(num);
            if (idxBlock !== -1) gameData.notesMatrix[r][c].splice(idxBlock, 1);
        }
    }
}

function processNumberInput(num) {
    if (!gameState.selectedCell || gameState.isPaused) return;
    
    var r = parseInt(gameState.selectedCell.getAttribute('data-row'), 10);
    var c = parseInt(gameState.selectedCell.getAttribute('data-col'), 10);
    var correctNum = gameData.solutionMatrix[r][c];

    saveStateToHistory(); // Guardar estado para Deshacer

    if (gameState.isNotesMode) {
        // Lógica de Lápiz
        if (gameData.userMatrix[r][c] === 0) { // Sólo si no hay número fijo
            var noteIndex = gameData.notesMatrix[r][c].indexOf(num);
            if (noteIndex === -1) {
                gameData.notesMatrix[r][c].push(num); // Agregar nota
            } else {
                gameData.notesMatrix[r][c].splice(noteIndex, 1); // Quitar nota
            }
            renderBoard();
        }
    } else {
        // Lógica Normal
        gameData.userMatrix[r][c] = num;
        
        if (num !== correctNum) {
            gameState.lives--;
            gameState.score += 300;
            if (gameState.lives <= 0) { handleGameOver(); }
        } else {
            // Si el número colocado es correcto, limpiar las notas cruzadas en otras celdas
            clearAdjacentNotes(r, c, num);
            checkVictory();
        }
        updateDashboard();
        renderBoard();
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