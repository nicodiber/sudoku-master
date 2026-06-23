// js/ui.js - Contiene funciones para manejar la interfaz de usuario, como mostrar/ocultar pantallas y modales, y actualizar el tablero y el panel de control del juego.

"use strict";

// Función para mostrar una pantalla específica y ocultar las demás
function showScreen(screenId) { // screenId: ID de la pantalla que queremos mostrar
    var screens = document.querySelectorAll('.screen'); // Selecciona todos los elementos con la clase 'screen' (todas las pantallas del juego)
    for (var i = 0; i < screens.length; i++) { // Itera sobre cada pantalla
        screens[i].classList.remove('active'); // Remueve la clase 'active' de todas las pantallas
        screens[i].classList.add('hidden'); // Agrega la clase 'hidden' para ocultarlas
    }
    document.getElementById(screenId).classList.remove('hidden'); // Muestra la pantalla deseada removiendo la clase 'hidden'
    document.getElementById(screenId).classList.add('active'); // Agrega la clase 'active' a la pantalla deseada para marcarla como visible
}

// Función para mostrar un modal específico y ocultar los demás
function showModal(modalId) { // modalId: ID del modal que queremos mostrar
    document.getElementById('modal-overlay').classList.remove('hidden'); // Muestra el overlay del modal removiendo la clase 'hidden'
    var modals = document.querySelectorAll('.modal-content'); // Selecciona todos los elementos con la clase 'modal-content' (todos los modales del juego)
    for (var i = 0; i < modals.length; i++) { // Itera sobre cada modal
        modals[i].classList.add('hidden'); // Agrega la clase 'hidden' a todos los modales para ocultarlos
    }
    document.getElementById(modalId).classList.remove('hidden'); // Muestra el modal deseado removiendo la clase 'hidden'
}

// Función para ocultar todos los modales y el overlay
function hideModals() {
    document.getElementById('modal-overlay').classList.add('hidden'); // Oculta el contenedor principal bloqueando la vista de cualquier modal activo
}

// Sincroniza los datos internos del estado del juego (gameState) con los elementos visuales de la interfaz (DOM)
function updateDashboard() {
    // Inserta dinámicamente el nombre del jugador en el panel superior del juego
    document.getElementById('game-player-name').innerText = gameState.playerName;
    // Muestra textualmente la dificultad seleccionada (Fácil, Medio, Difícil)
    document.getElementById('game-difficulty-label').innerText = gameState.difficulty;
    
    // Generación visual de las vidas: Crea una cadena de caracteres usando el símbolo de corazón
    var livesHtml = "";
    for (var i = 0; i < gameState.lives; i++) { livesHtml += "❤"; } // Concatena un corazón por cada vida que le quede al usuario

    // Renderiza los corazones directamente en el contenedor del DOM
    document.getElementById('lives-display').innerText = livesHtml; 
    
    // Invoca la validación de números completados para mantener actualizado el teclado en pantalla
    checkCompletedNumbers();
}

// Verifica qué números ya están colocados 9 veces correctamente. Si se completa, cambia visualmente con CSS (.completed).
function checkCompletedNumbers() {
    // Estructura de datos para contar los aciertos de cada número
    var counts = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0};
    
    // Algoritmo de conteo: Recorre la matriz bidimensional (9x9) buscando coincidencias exactas con la solución
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            var val = gameData.userMatrix[r][c]; // Valor actual que el jugador tiene en esa celda

            // Si la celda no está vacía (distinto de 0) y además coincide con la matriz solución analizada por el sistema
            if (val !== 0 && val === gameData.solutionMatrix[r][c]) {
                counts[val]++; // Incrementa en 1 el contador de aciertos de ese dígito específico
            }
        }
    }
    
    // Manipulación de la interfaz: Lee las teclas numéricas del DOM para aplicar los cambios visuales
    var keys = document.querySelectorAll('.key-num');
    for (var k = 0; k < keys.length; k++) {
        // Convierte el atributo de texto 'data-num' del HTML a un número entero en base 10
        var num = parseInt(keys[k].getAttribute('data-num'), 10);

        // Si el mapa de frecuencias indica que el dígito ya se colocó 9 veces de forma correcta
        if (counts[num] === 9) {
            keys[k].classList.add('completed'); // Agrega la clase CSS que cambia el color
        } else {
            keys[k].classList.remove('completed'); // Retirar la clase si el usuario borró o deshizo jugada
        }
    }
}

// Formatea un número entero de segundos a un formato estándar de reloj cronómetro legible (MM:SS)
function formatTime(seconds) {
    // Divide los segundos totales por 60 y redondea hacia abajo para obtener los minutos enteros
    var m = Math.floor(seconds / 60);
    // Aplica el operador % módulo (o residuo) para extraer los segundos restantes que no alcanzan a formar un minuto
    var s = seconds % 60;

    // Retorna la cadena de texto estructurada. 
    // Utiliza operadores para aplicar "un cero a la izquierda" si los minutos o los segundos son menores a 10, garantizando mostrar siempre dos dígitos por sección (MM:SS)
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}