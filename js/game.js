// js/game.js - Contiene la lógica principal del juego, incluyendo la inicialización, el manejo de entradas del usuario, la validación de movimientos y la gestión del estado del juego.

"use strict";

// Inicializa una matriz 9x9 llena de arrays vacíos para las notas del usuario
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

// Evitar trampas mediante el uso del botón Deshacer. Solo se restaura el tablero y las notas, no las vidas ni los puntos
function undoLastAction() {
    // Si no hay historial o el juego está pausado, no hace nada
    if (gameState.history.length === 0 || gameState.isPaused) return;

    // Extraer el último elemento del array
    var lastState = gameState.history.pop();
    
    // Se restaura el tablero y las notas
    gameData.userMatrix = lastState.userMatrix;
    gameData.notesMatrix = lastState.notesMatrix;
    
    updateDashboard();
    renderBoard();
}

// Inicializa el juego según la dificultad seleccionada
function initGame(difficulty) {
    // Reseteo de estados al iniciar nueva partida
    gameState.difficulty = difficulty; 
    gameState.timeElapsed = 0;
    gameState.lives = 5;
    gameState.selectedCell = null;
    gameState.isPaused = false;
    gameState.isNotesMode = false;
    gameState.history = [];
    document.getElementById('btn-notes').classList.remove('active'); // Asegura que el botón de notas no esté activo al iniciar
    
    var clues = 0;
    document.body.className = ''; 
    
    // Definición de parámetros por nivel: numeros prellenados y puntos base
    if (difficulty === 'Fácil') {
        clues = getRandomInt(45, 50);
        gameState.baseScore = 5000; // 5000 / 60 = 83,3. Equivale a 83 minutos.
        document.body.classList.add('theme-easy'); // Cambia el tema visual para el nivel fácil
    } else if (difficulty === 'Medio') {
        clues = getRandomInt(36, 44);
        gameState.baseScore = 2500; // 2500 / 60 = 41,6. Equivale a 42 minutos.
        document.body.classList.add('theme-medium'); // Cambia el tema visual para el nivel medio
    } else {
        clues = getRandomInt(28, 35);
        gameState.baseScore = 0;
        document.body.classList.add('theme-hard'); // Cambia el tema visual para el nivel difícil
    }
    
    gameState.score = gameState.baseScore; // Inicializa la puntuación

    gameData.solutionMatrix = shuffleSudokuMatrix(); // Mezcla el tablero base para obtener una solución válida diferente
    gameData.maskedMatrix = maskMatrix(gameData.solutionMatrix, clues);  // Oculta números según la dificultad
    gameData.userMatrix = deepCopyMatrix(gameData.maskedMatrix); // Inicializa el tablero para el usuario
    gameData.notesMatrix = createEmptyNotes(); // Inicializa la matriz de notas vacía

    updateDashboard();
    renderBoard(); // Renderiza el tablero en el DOM
    startTimer();
    
    document.getElementById('board-overlay').classList.add('hidden'); // Oculta el menú inicial
    showScreen('game-screen'); // Muestra la pantalla del juego
}

// Inicia el cronómetro y actualiza el display cada segundo
function startTimer() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(function() {
        if (!gameState.isPaused) {
            gameState.timeElapsed++;
            document.getElementById('timer-display').innerText = formatTime(gameState.timeElapsed);
        }
    }, 1000);
}

// Detiene el cronómetro y limpia la referencia para evitar múltiples intervalos
function stopTimer() {
    clearInterval(gameState.timerInterval);
}

// Traduce las matrices de JavaScript a elementos HTML (DOM)
function renderBoard() {
    var boardContainer = document.getElementById('sudoku-board');
    boardContainer.innerHTML = ''; // Limpia el tablero viejo
    
    // Distribución Numpad para las notas
    var notesLayoutMap = [7, 8, 9, 4, 5, 6, 1, 2, 3]; 

    // Bucles para crear las 81 celdas (9x9)
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            var cell = document.createElement('div'); // Crea un div para cada celda
            cell.className = 'sudoku-cell'; // Clase base para todas las celdas
            cell.setAttribute('data-row', r); // Atributo para identificar la fila (row)
            cell.setAttribute('data-col', c); // Atributo para identificar la columna (column)
            
            var val = gameData.userMatrix[r][c];
            var isClue = gameData.maskedMatrix[r][c] !== 0; // ¿Es una pista fija inicial?
            
            if (isClue) {
                cell.innerText = val;
                cell.classList.add('clue'); // Celdas iniciales (grises) bloqueadas
            } else if (val !== 0) {
                cell.innerText = val;
                // Si el número ingresado no coincide con la solución, se marca en rojo
                if (val !== gameData.solutionMatrix[r][c]) {
                    cell.classList.add('error');
                }
            } else {
                // Si la celda está vacía, verificamos si tiene "notas" (modo lápiz)
                var notes = gameData.notesMatrix[r][c];
                if (notes.length > 0) {
                    // Crea una sub-cuadrícula interna para las notas
                    var notesContainer = document.createElement('div');
                    notesContainer.className = 'notes-container';
                    
                    // Iteración para dibujar notas en orden (del Numpad)
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
            
            // Persistencia visual de la selección tras re-renderizar
            if (gameState.selectedCell && 
                parseInt(gameState.selectedCell.getAttribute('data-row'), 10) === r && 
                parseInt(gameState.selectedCell.getAttribute('data-col'), 10) === c) {
                cell.classList.add('selected');
                gameState.selectedCell = cell; 
            }
            
            cell.addEventListener('click', onCellClick); // Agrega evento de click a la celda
            boardContainer.appendChild(cell); // Inyecta la celda al DOM
        }
    }
}

// Maneja el evento de click en una celda del tablero
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

// Validación cruzada de notas tras usuario colocar número correcto (Limpia las notas relacioandas)
function clearAdjacentNotes(row, col, num) {
    var r, c;
    // Limpieza de Fila y Columna
    for (var i = 0; i < 9; i++) {
        var idxCol = gameData.notesMatrix[row][i].indexOf(num);
        if (idxCol !== -1) gameData.notesMatrix[row][i].splice(idxCol, 1);
        
        var idxRow = gameData.notesMatrix[i][col].indexOf(num);
        if (idxRow !== -1) gameData.notesMatrix[i][col].splice(idxRow, 1);
    }
    // Limpieza del Bloque 3x3
    var startR = Math.floor(row / 3) * 3;
    var startC = Math.floor(col / 3) * 3;
    // Iteración sobre el bloque 3x3
    for (r = startR; r < startR + 3; r++) {
        for (c = startC; c < startC + 3; c++) {
            var idxBlock = gameData.notesMatrix[r][c].indexOf(num); // Si el número está en las notas, se elimina
            if (idxBlock !== -1) gameData.notesMatrix[r][c].splice(idxBlock, 1);
        }
    }
}

// Procesa la entrada del usuario (ya sea en modo normal o modo lápiz)
function processNumberInput(num) {
    if (!gameState.selectedCell || gameState.isPaused) return; // Validación de seguridad: Si no hay celda seleccionada o el juego está pausado, no hace nada
    
    // Extrae coordenadas desde el elemento HTML seleccionado
    var r = parseInt(gameState.selectedCell.getAttribute('data-row'), 10); // Extrae la fila
    var c = parseInt(gameState.selectedCell.getAttribute('data-col'), 10); // Extrae la columna 
    var correctNum = gameData.solutionMatrix[r][c]; // Número correcto según la solución

    saveStateToHistory(); // Guardar estado actual antes de modificarlo para el Deshacer

    if (gameState.isNotesMode) {
        // Lógica MODO LÁPIZ: agrega o quita arrays a la matriz de notas sin afectar la matriz de usuario
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
        // Lógica MODO NORMAL: coloca el número en la matriz de usuario y valida contra la solución
        gameData.userMatrix[r][c] = num;
        
        if (num !== correctNum) { // Si el número colocado es incorrecto
            gameState.lives--; // Resta una vida
            gameState.score += 300; // Penalización de puntos por error
            if (gameState.lives <= 0) { handleGameOver(); }
        } else { // Si el número colocado es correcto
            clearAdjacentNotes(r, c, num); // Limpiar notas cruzadas
            checkVictory(); // Verifica si el jugador ha completado correctamente el Sudoku
        }
        updateDashboard();
        renderBoard();
    }
}

// Maneja la situación de Game Over
function handleGameOver() {
    stopTimer(); // Detiene el cronómetro
    gameState.isPaused = true; // Pausa el juego para evitar más interacciones
    showModal('modal-game-over'); // Muestra el modal de Game Over
}

// Verifica si el jugador ha completado correctamente el Sudoku
function checkVictory() {
    var isComplete = true; // Bandera para determinar si el Sudoku está completo y correcto
    // Itera sobre todas las celdas para verificar si coinciden con la solución
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            if (gameData.userMatrix[r][c] !== gameData.solutionMatrix[r][c]) {
                isComplete = false; // Si alguna celda no coincide, el Sudoku no está completo
                break;
            }
        }
    }
    
    // Si el Sudoku está completo y correcto, se detiene el cronómetro, se pausa el juego y se muestra la pantalla de victoria
    if (isComplete) {
        stopTimer(); // Detiene el cronómetro
        gameState.isPaused = true; // Pausa el juego para evitar más interacciones
        gameState.score += gameState.timeElapsed; // Se suma el tiempo transcurrido al puntaje
        document.getElementById('victory-score').innerText = gameState.score; // Actualiza el puntaje en el modal de victoria
        saveScore(); // Guarda el puntaje en el almacenamiento local
        showModal('modal-victory'); // Muestra el modal de victoria
    }
}