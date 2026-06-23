"use strict";

// Cierre global de modales
var closeBtns = document.querySelectorAll('.btn-close-modal');
for (var i = 0; i < closeBtns.length; i++) {
    closeBtns[i].addEventListener('click', hideModals);
}

// Paso 0: Login
var inputLogin = document.getElementById('login-name');
var btnLogin = document.getElementById('btn-login');

inputLogin.addEventListener('input', function() {
    var val = inputLogin.value;
    var isAlphanumeric = /^[a-zA-Z0-9]+$/.test(val);
    btnLogin.disabled = !(val.length >= 3 && isAlphanumeric);
});

btnLogin.addEventListener('click', function() {
    gameState.playerName = inputLogin.value;
    document.getElementById('menu-greeting').innerText = "Bienvenido, " + gameState.playerName;
    showScreen('main-menu-screen');
});

document.getElementById('btn-edit-name').addEventListener('click', function() {
    inputLogin.value = "";
    btnLogin.disabled = true;
    showScreen('login-screen');
});

// Menú Principal
document.getElementById('btn-rules').addEventListener('click', function() { showModal('modal-rules'); });
document.getElementById('btn-ranking').addEventListener('click', openRanking);
document.getElementById('btn-contact').addEventListener('click', function() { showModal('modal-contact'); });

document.getElementById('btn-play-easy').addEventListener('click', function() { initGame('Fácil'); });
document.getElementById('btn-play-medium').addEventListener('click', function() { initGame('Medio'); });
document.getElementById('btn-play-hard').addEventListener('click', function() { initGame('Difícil'); });

// Formulario de Contacto
var contactName = document.getElementById('contact-name');
var contactEmail = document.getElementById('contact-email');
var contactMessage = document.getElementById('contact-message');
var btnSendContact = document.getElementById('btn-send-contact');

function validateContact() {
    var isNameValid = /^[a-zA-Z0-9]+$/.test(contactName.value);
    var isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.value);
    var isMsgValid = contactMessage.value.length > 5;
    btnSendContact.disabled = !(isNameValid && isEmailValid && isMsgValid);
}

contactName.addEventListener('input', validateContact);
contactEmail.addEventListener('input', validateContact);
contactMessage.addEventListener('input', validateContact);

btnSendContact.addEventListener('click', function() {
    var mailtoLink = "mailto:" + contactEmail.value + "?subject=Contacto Sudoku (" + contactName.value + ")&body=" + encodeURIComponent(contactMessage.value);
    window.location.href = mailtoLink;
    hideModals();
});

// Eventos del Teclado Inferior (Panel)
var keyNums = document.querySelectorAll('.key-num');
for (var k = 0; k < keyNums.length; k++) {
    keyNums[k].addEventListener('click', function(e) {
        var num = parseInt(e.target.getAttribute('data-num'), 10);
        processNumberInput(num);
    });
}

// Botones Nota y Goma
document.getElementById('btn-notes').addEventListener('click', function(e) {
    gameState.isNotesMode = !gameState.isNotesMode;
    if (gameState.isNotesMode) {
        e.target.classList.add('active');
    } else {
        e.target.classList.remove('active');
    }
});

document.getElementById('btn-undo').addEventListener('click', undoLastAction);

document.getElementById('key-eraser').addEventListener('click', function() {
    if (gameState.selectedCell && !gameState.isPaused) {
        var r = parseInt(gameState.selectedCell.getAttribute('data-row'), 10);
        var c = parseInt(gameState.selectedCell.getAttribute('data-col'), 10);
        if (gameData.maskedMatrix[r][c] === 0) {
            saveStateToHistory(); // Guardar para poder Deshacer borrado
            gameData.userMatrix[r][c] = 0;
            gameData.notesMatrix[r][c] = [];
            renderBoard();
            updateDashboard();
        }
    }
});

// Soporte teclado físico del Sistema y navegación por flechas
window.addEventListener('keydown', function(e) {
    if (document.getElementById('game-screen').classList.contains('active') && !gameState.isPaused) {
        if (e.key >= '1' && e.key <= '9') {
            processNumberInput(parseInt(e.key, 10));
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            document.getElementById('key-eraser').click();
        } else if (e.key.toLowerCase() === 'n') { // Atajo rápido Lápiz para notas
            document.getElementById('btn-notes').click();
        } else if (e.ctrlKey && e.key.toLowerCase() === 'z') { // Atajo rápido Deshacer
            document.getElementById('btn-undo').click();
        } else if (e.key.indexOf('Arrow') === 0 && gameState.selectedCell) {
            // Navegación con flechas, evitando que el navegador baje la página
            e.preventDefault(); 
            var r = parseInt(gameState.selectedCell.getAttribute('data-row'), 10);
            var c = parseInt(gameState.selectedCell.getAttribute('data-col'), 10);

            // Cálculos para evitar salir de los límites de la matriz (0 a 8)
            if (e.key === 'ArrowUp') r = Math.max(0, r - 1);
            else if (e.key === 'ArrowDown') r = Math.min(8, r + 1);
            else if (e.key === 'ArrowLeft') c = Math.max(0, c - 1);
            else if (e.key === 'ArrowRight') c = Math.min(8, c + 1);

            // Búsqueda y actualización de la celda objetivo en el DOM
            var nextCell = document.querySelector('.sudoku-cell[data-row="' + r + '"][data-col="' + c + '"]');
            if (nextCell) {
                var cells = document.querySelectorAll('.sudoku-cell');
                for (var j = 0; j < cells.length; j++) {
                    cells[j].classList.remove('selected');
                }
                nextCell.classList.add('selected');
                gameState.selectedCell = nextCell;
            }
        }
    }
});

// Botones Superiores (Juego y Pausa)
document.getElementById('btn-abandon').addEventListener('click', function() {
    stopTimer();
    document.body.className = '';
    showScreen('main-menu-screen');
});

document.getElementById('btn-pause').addEventListener('click', function() {
    gameState.isPaused = true;
    document.getElementById('board-overlay').classList.remove('hidden');
    showModal('modal-pause');
});

document.getElementById('btn-resume-game').addEventListener('click', function() {
    gameState.isPaused = false;
    document.getElementById('board-overlay').classList.add('hidden');
    hideModals();
});

document.getElementById('btn-abandon-paused').addEventListener('click', function() {
    hideModals();
    document.getElementById('btn-abandon').click();
});

document.getElementById('btn-restart').addEventListener('click', function() {
    gameState.isPaused = true; 
    showModal('modal-restart-confirm');
});

document.getElementById('btn-cancel-restart').addEventListener('click', function() {
    gameState.isPaused = false; 
    hideModals();
});

document.getElementById('btn-confirm-restart').addEventListener('click', function() {
    saveStateToHistory();
    gameData.userMatrix = deepCopyMatrix(gameData.maskedMatrix);
    gameData.notesMatrix = createEmptyNotes();
    renderBoard();
    updateDashboard();
    gameState.selectedCell = null;
    gameState.isPaused = false; 
    hideModals();
});

document.getElementById('btn-game-over-close').addEventListener('click', function() {
    hideModals();
    document.getElementById('btn-abandon').click();
});

document.getElementById('btn-victory-close').addEventListener('click', function() {
    hideModals();
    document.getElementById('btn-abandon').click();
});