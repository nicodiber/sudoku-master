// js/storage.js - Contiene funciones para guardar y recuperar el ranking de puntajes del jugador usando localStorage.

"use strict";

// localStorage permite guardar cadenas de texto en el navegador de forma permanente

// Función para guardar el puntaje del jugador en el ranking
function saveScore() {
    // Intentamos traer el ranking. Si es nulo (primera vez), creamos un array vacío "[]"
    // JSON.parse convierte el texto guardado de nuevo a un objeto/array de JavaScript
    var history = JSON.parse(localStorage.getItem('sudoku_master_ranking') || "[]");
    
    // Construcción del Timestamp para registrar cuándo se jugó la partida
    var dateObj = new Date();
    var day = ("0" + dateObj.getDate()).slice(-2);                                      // Asegura que el día tenga dos dígitos
    var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);                             // Los meses en JavaScript son 0-indexados, por eso sumamos 1
    var year = dateObj.getFullYear();                                                   // Obtiene el año completo (4 dígitos)
    var hours = ("0" + dateObj.getHours()).slice(-2);                                   // Asegura que la hora tenga dos dígitos
    var minutes = ("0" + dateObj.getMinutes()).slice(-2);                               // Asegura que los minutos tengan dos dígitos
    var dateString = day + "/" + month + "/" + year + " " + hours + ":" + minutes;      // Formato final: DD/MM/YYYY HH:MM

    // Objeto para guardar el nuevo registro
    var newRecord = {
        nombre: gameState.playerName,
        puntos: gameState.score,
        dificultad: gameState.difficulty,
        fecha: dateString
    };

    history.push(newRecord); // Agregamos el nuevo registro al historial

    // Orden ascendente (menor puntaje = mejor ranking)
    history.sort(function(a, b) { return a.puntos - b.puntos; });

    // localStorage SOLO acepta strings, por lo que usamos JSON.stringify para convertir el array como una cadena de texto
    localStorage.setItem('sudoku_master_ranking', JSON.stringify(history));
}

// Función para abrir el modal de ranking y mostrar los registros guardados
function openRanking() {
    var listContainer = document.getElementById('ranking-list'); // Contenedor donde se mostrarán los registros del ranking
    listContainer.innerHTML = ''; // Limpiam el contenido previo para evitar duplicados
    
    var history = JSON.parse(localStorage.getItem('sudoku_master_ranking') || "[]"); // Traemos el historial de partidas guardadas, o un array vacío si no hay registros
    
    if (history.length === 0) { // Si no hay registros, mostramos mensaje
        listContainer.innerHTML = "<p>Aún no hay partidas ganadas registradas.</p>";
    } else { // Si hay registros, los mostramos en orden ascendente de puntaje
        for (var i = 0; i < history.length; i++) { // Iteramos sobre cada registro del historial
            var itemDiv = document.createElement('div'); // Creamos un div para cada registro
            itemDiv.className = 'ranking-item'; // Asignamos una clase para estilos CSS
            // Construimos el contenido del registro con nombre, puntaje, dificultad y fecha
            itemDiv.innerHTML = "<strong>" + (i + 1) + ". " + history[i].nombre + "</strong>" +  history[i].puntos + " (" + history[i].dificultad + ")<br><em>" + history[i].fecha + "</em>";
            listContainer.appendChild(itemDiv); // Agregamos el div al contenedor principal del ranking
        }
    }
    showModal('modal-ranking'); // Muestra el modal de ranking
}