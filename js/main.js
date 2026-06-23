// js/main.js - Contiene la inicialización del juego, la interacción del usuario con la interfaz y la gestión de modales.

"use strict";

// Cierre global de modales
var closeBtns = document.querySelectorAll('.btn-close-modal');
for (var i = 0; i < closeBtns.length; i++) {
    closeBtns[i].addEventListener('click', hideModals);
}

// Login
var inputLogin = document.getElementById('login-name');
var btnLogin = document.getElementById('btn-login');

// Validación del nombre de usuario: al menos 3 caracteres y solo alfanumérico
inputLogin.addEventListener('input', function() {
    var val = inputLogin.value; // Obtenemos el valor actual del input
    var isAlphanumeric = /^[a-zA-Z0-9]+$/.test(val); // Validamos que solo contenga letras y números
    btnLogin.disabled = !(val.length >= 3 && isAlphanumeric); // Habilitamos el botón si cumple las condiciones
});

// Evento tras click en botón login
btnLogin.addEventListener('click', function() {
    gameState.playerName = inputLogin.value; // Guardamos el nombre del jugador en el estado del juego
    document.getElementById('menu-greeting').innerText = "Bienvenido, " + gameState.playerName; // Actualizamos el saludo en el menú principal
    showScreen('main-menu-screen'); // Mostramos la pantalla del menú principal
});

// Botón para editar el nombre de usuario desde el menú principal
document.getElementById('btn-edit-name').addEventListener('click', function() {
    inputLogin.value = ""; // Limpiamos el input para que el usuario pueda escribir un nuevo nombre
    inputLogin.focus(); // Colocamos el cursor en el input para que el usuario pueda empezar a escribir de inmediato
    btnLogin.disabled = true; // Deshabilitamos el botón hasta que el usuario ingrese un nombre válido
    showScreen('login-screen'); // Mostramos la pantalla de login para que el usuario pueda cambiar su nombre
});

// Menú Principal
document.getElementById('btn-rules').addEventListener('click', function() { showModal('modal-rules'); }); // Muestra el modal de reglas
document.getElementById('btn-ranking').addEventListener('click', openRanking); // Muestra el modal de ranking y carga los registros guardados
document.getElementById('btn-contact').addEventListener('click', function() { showModal('modal-contact'); }); // Muestra el modal de contacto

document.getElementById('btn-play-easy').addEventListener('click', function() { initGame('Fácil'); }); // Inicia el juego con dificultad Fácil
document.getElementById('btn-play-medium').addEventListener('click', function() { initGame('Medio'); }); // Inicia el juego con dificultad Medio
document.getElementById('btn-play-hard').addEventListener('click', function() { initGame('Difícil'); }); // Inicia el juego con dificultad Difícil

// Formulario de Contacto
var contactName = document.getElementById('contact-name'); // Input para el nombre del usuario en el formulario de contacto
var contactEmail = document.getElementById('contact-email'); // Input para el correo electrónico del usuario en el formulario de contacto
var contactMessage = document.getElementById('contact-message'); // Input para el mensaje del usuario en el formulario de contacto
var btnSendContact = document.getElementById('btn-send-contact'); // Botón para enviar el formulario de contacto, deshabilitado hasta que se cumplan validaciones

// Validación de campos del formulario de contacto
function validateContact() {
    var isNameValid = /^[a-zA-Z0-9]+$/.test(contactName.value); // Validación que nombre solo contenga letras y números
    var isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.value); // Validación que correo electrónico tenga formato válido
    var isMsgValid = contactMessage.value.length > 5; // Validación que mensaje tenga más de 5 caracteres
    btnSendContact.disabled = !(isNameValid && isEmailValid && isMsgValid); // Si todos los campos son válidos, habilita el botón de enviar
}

// Eventos de validación en tiempo real para los campos del formulario de contacto
contactName.addEventListener('input', validateContact);
contactEmail.addEventListener('input', validateContact);
contactMessage.addEventListener('input', validateContact);

// Evento al hacer click en el botón de enviar contacto
btnSendContact.addEventListener('click', function() { // Se construye un enlace mailto con los datos del formulario y se abre el cliente de correo predeterminado
    var mailtoLink = "mailto:" + contactEmail.value + "?subject=Contacto Sudoku (" + contactName.value + ")&body=" + encodeURIComponent(contactMessage.value);
    window.location.href = mailtoLink; // Redirige al usuario al cliente de correo predeterminado con los campos prellenados
    hideModals(); // Cierra el modal de contacto después de enviar
});

// Teclado virtual del juego
var keyNums = document.querySelectorAll('.key-num'); // Selecciona todos los botones del teclado virtual que representan números del 1 al 9
for (var k = 0; k < keyNums.length; k++) { // Agrega un evento de click a cada botón del teclado virtual
    keyNums[k].addEventListener('click', function(e) { // Cuando click en botón del teclado virtual, se obtiene el número correspondiente y se procesa la entrada
        var num = parseInt(e.target.getAttribute('data-num'), 10); // Obtenemos el número del atributo data-num del botón clickeado y lo convertimos a entero
        processNumberInput(num); // Llamamos a la función que procesa la entrada del número en el tablero de Sudoku
    });
}

// Botones Lápiz
document.getElementById('btn-notes').addEventListener('click', function(e) { // Alterna el modo de notas (lápiz)
    gameState.isNotesMode = !gameState.isNotesMode; // Cambia al estado opuesto (true/false)
    if (gameState.isNotesMode) { // Si el modo de notas está activado
        e.target.classList.add('active'); // Agrega la clase 'active' al botón para indicar visualmente que está activado
    } else { // Si el modo de notas está desactivado
        e.target.classList.remove('active'); // Remueve la clase 'active' del botón para indicar visualmente que está desactivado
    }
});

// Botón Deshacer
document.getElementById('btn-undo').addEventListener('click', undoLastAction);

// Botón Goma (borrador)
document.getElementById('key-eraser').addEventListener('click', function() {
    if (gameState.selectedCell && !gameState.isPaused) { // Verifica que haya una celda seleccionada y que el juego no esté pausado
        var r = parseInt(gameState.selectedCell.getAttribute('data-row'), 10); // Obtiene la fila de la celda seleccionada
        var c = parseInt(gameState.selectedCell.getAttribute('data-col'), 10); // Obtiene la columna de la celda seleccionada
        if (gameData.maskedMatrix[r][c] === 0) { // Verifica que la celda seleccionada sea editable
            saveStateToHistory(); // Guarda el estado actual antes de borrar para permitir deshacer
            gameData.userMatrix[r][c] = 0; // Borra el número de la celda
            gameData.notesMatrix[r][c] = []; // Borra las notas asociadas a la celda
            renderBoard();
            updateDashboard();
        }
    }
});

// Eventos de teclado físico para ingresar números, borrar, alternar lápiz y deshacer
window.addEventListener('keydown', function(e) {
    // Solo procesamos la entrada si estamos en la pantalla de juego y el juego no está pausado
    if (document.getElementById('game-screen').classList.contains('active') && !gameState.isPaused) {
        if (e.key >= '1' && e.key <= '9') { // Si la tecla presionada es un número del 1 al 9
            processNumberInput(parseInt(e.key, 10)); // Convertimos la tecla a número entero y procesamos la entrada
        } else if (e.key === 'Backspace' || e.key === 'Delete') { // Si la tecla presionada es Backspace o Delete, activamos la función de borrado
            document.getElementById('key-eraser').click(); // Simulamos un click en el botón de borrador para borrar la celda seleccionada
        } else if (e.key.toLowerCase() === 'n') { // Atajo rápido para alternar el modo de notas
            document.getElementById('btn-notes').click(); // Simulamos un click en el botón de notas para alternar el modo lápiz
        } else if (e.ctrlKey && e.key.toLowerCase() === 'z') { // Atajo rápido para deshacer la última acción
            document.getElementById('btn-undo').click(); // Simulamos un click en el botón de deshacer para revertir la última acción
        } else if (e.key.indexOf('Arrow') === 0 && gameState.selectedCell) { // Si la tecla presionada es una flecha y hay una celda seleccionada, navegamos entre celdas
            // Navegación con flechas, evitando que el navegador baje la página
            e.preventDefault(); 
            var r = parseInt(gameState.selectedCell.getAttribute('data-row'), 10); // Obtiene la fila de la celda seleccionada
            var c = parseInt(gameState.selectedCell.getAttribute('data-col'), 10); // Obtiene la columna de la celda seleccionada

            // Cálculos para evitar salir de los límites de la matriz (0 a 8)
            if (e.key === 'ArrowUp') r = Math.max(0, r - 1);
            else if (e.key === 'ArrowDown') r = Math.min(8, r + 1);
            else if (e.key === 'ArrowLeft') c = Math.max(0, c - 1);
            else if (e.key === 'ArrowRight') c = Math.min(8, c + 1);

            // Búsqueda y actualización de la celda objetivo en el DOM
            var nextCell = document.querySelector('.sudoku-cell[data-row="' + r + '"][data-col="' + c + '"]');
            if (nextCell) { // Si la celda existe, actualizamos la selección visual y el estado del juego
                var cells = document.querySelectorAll('.sudoku-cell');
                for (var j = 0; j < cells.length; j++) {
                    cells[j].classList.remove('selected');
                }
                nextCell.classList.add('selected');
                gameState.selectedCell = nextCell; // Actualizamos la referencia a la celda seleccionada en el estado del juego
            }
        }
    }
});

// Botón abandono del juego
document.getElementById('btn-abandon').addEventListener('click', function() { // Evento al hacer click en el botón de abandonar el juego
    stopTimer(); // Detiene el cronómetro del juego
    document.body.className = ''; // Resetea cualquier clase de dificultad aplicada al body
    showScreen('main-menu-screen'); // Muestra la pantalla del menú principal
});

// Botón pausa
document.getElementById('btn-pause').addEventListener('click', function() { // Evento al hacer click en el botón de pausa del juego
    gameState.isPaused = true; // Cambia el estado del juego a pausado
    document.getElementById('board-overlay').classList.remove('hidden'); // Muestra overlay sobre tablero indicando juego pausado
    showModal('modal-pause'); // Muestra el modal de pausa
});

// Botones del modal de pausa
document.getElementById('btn-resume-game').addEventListener('click', function() { // Evento al hacer click en el botón de reanudar el juego desde el modal de pausa
    gameState.isPaused = false; // Cambia el estado del juego a no pausado
    document.getElementById('board-overlay').classList.add('hidden'); // Oculta el overlay sobre el tablero
    hideModals(); // Cierra el modal de pausa
});

// Botón de abandonar desde el modal de pausa
document.getElementById('btn-abandon-paused').addEventListener('click', function() { // Evento al hacer click en el botón de abandonar el juego desde el modal de pausa
    hideModals(); // Cierra el modal de pausa
    document.getElementById('btn-abandon').click(); // Simula un click en el botón de abandonar el juego para ejecutar la lógica de abandono
});

// Botón reiniciar partida
document.getElementById('btn-restart').addEventListener('click', function() { // Evento al hacer click en el botón de reiniciar la partida
    gameState.isPaused = true; // Pausa el juego antes de mostrar el modal de confirmación
    showModal('modal-restart-confirm'); // Muestra el modal de confirmación para reiniciar la partida
});

// Botones del modal de reinicio de partida
document.getElementById('btn-cancel-restart').addEventListener('click', function() { // Evento al hacer click en el botón cancelar reinicio de partida desde el modal confirmación
    gameState.isPaused = false; // Reanuda el juego si el usuario decide no reiniciar
    hideModals(); // Cierra el modal de confirmación de reinicio de partida
});

// Confirmación de reinicio de partida
document.getElementById('btn-confirm-restart').addEventListener('click', function() { // Evento al hacer click en el botón confirmar reinicio de partida desde el modal confirmación
    saveStateToHistory(); // Guarda el estado actual antes de reiniciar para permitir deshacer
    gameData.userMatrix = deepCopyMatrix(gameData.maskedMatrix); // Reinicia la matriz del usuario a la matriz inicial
    gameData.notesMatrix = createEmptyNotes(); // Reinicia la matriz de notas
    renderBoard();
    updateDashboard();
    gameState.selectedCell = null; // Resetea la celda seleccionada
    gameState.isPaused = false; // Reanuda el juego después de reiniciar
    hideModals(); // Cierra el modal de confirmación de reinicio de partida
});

// Botones de cierre de modales

// Botón de victoria
document.getElementById('btn-game-over-close').addEventListener('click', function() { // Evento al hacer click en el botón de cerrar el modal de victoria
    hideModals(); // Cierra el modal de victoria
    document.getElementById('btn-abandon').click(); // Simula un click en el botón de abandonar el juego para ejecutar la lógica de abandono y volver al menú principal
});

// Botón de derrota
document.getElementById('btn-victory-close').addEventListener('click', function() { // Evento al hacer click en el botón de cerrar el modal de derrota
    hideModals(); // Cierra el modal de derrota
    document.getElementById('btn-abandon').click(); // Simula un click en el botón de abandonar el juego para ejecutar la lógica de abandono y volver al menú principal
});