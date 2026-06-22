"use strict";

function saveScore() {
    var history = JSON.parse(localStorage.getItem('sudoku_master_ranking') || "[]");
    
    var dateObj = new Date();
    var day = ("0" + dateObj.getDate()).slice(-2);
    var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    var year = dateObj.getFullYear();
    var hours = ("0" + dateObj.getHours()).slice(-2);
    var minutes = ("0" + dateObj.getMinutes()).slice(-2);
    var dateString = day + "/" + month + "/" + year + " " + hours + ":" + minutes;

    var newRecord = {
        nombre: gameState.playerName,
        puntos: gameState.score,
        dificultad: gameState.difficulty,
        fecha: dateString
    };

    history.push(newRecord);
    // Menor puntaje es mejor
    history.sort(function(a, b) {
        return a.puntos - b.puntos;
    });

    localStorage.setItem('sudoku_master_ranking', JSON.stringify(history));
}

function openRanking() {
    var listContainer = document.getElementById('ranking-list');
    listContainer.innerHTML = '';
    
    var history = JSON.parse(localStorage.getItem('sudoku_master_ranking') || "[]");
    
    if (history.length === 0) {
        listContainer.innerHTML = "<p>Aún no hay partidas ganadas registradas.</p>";
    } else {
        for (var i = 0; i < history.length; i++) {
            var itemDiv = document.createElement('div');
            itemDiv.className = 'ranking-item';
            itemDiv.innerHTML = "<strong>" + (i + 1) + ". " + history[i].nombre + "</strong> - " + 
                                history[i].puntos + " pts (" + history[i].dificultad + ")<br><em>" + history[i].fecha + "</em>";
            listContainer.appendChild(itemDiv);
        }
    }
    showModal('modal-ranking');
}