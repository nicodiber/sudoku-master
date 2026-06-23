"use strict";

function showScreen(screenId) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
        screens[i].classList.add('hidden');
    }
    document.getElementById(screenId).classList.remove('hidden');
    document.getElementById(screenId).classList.add('active');
}

function showModal(modalId) {
    document.getElementById('modal-overlay').classList.remove('hidden');
    var modals = document.querySelectorAll('.modal-content');
    for (var i = 0; i < modals.length; i++) {
        modals[i].classList.add('hidden');
    }
    document.getElementById(modalId).classList.remove('hidden');
}

function hideModals() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

function updateDashboard() {
    document.getElementById('game-player-name').innerText = gameState.playerName;
    document.getElementById('game-difficulty-label').innerText = gameState.difficulty;
    
    var livesHtml = "";
    for (var i = 0; i < gameState.lives; i++) { livesHtml += "❤"; }
    document.getElementById('lives-display').innerText = livesHtml;
    
    checkCompletedNumbers();
}

// Verifica qué números ya están colocados 9 veces correctamente para colorearlos de verde
function checkCompletedNumbers() {
    var counts = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0};
    
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            var val = gameData.userMatrix[r][c];
            if (val !== 0 && val === gameData.solutionMatrix[r][c]) {
                counts[val]++;
            }
        }
    }
    
    var keys = document.querySelectorAll('.key-num');
    for (var k = 0; k < keys.length; k++) {
        var num = parseInt(keys[k].getAttribute('data-num'), 10);
        if (counts[num] === 9) {
            keys[k].classList.add('completed');
        } else {
            keys[k].classList.remove('completed');
        }
    }
}

function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}