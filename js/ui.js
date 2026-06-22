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
    document.getElementById('score-display').innerText = gameState.score;
    
    var livesHtml = "";
    for (var i = 0; i < gameState.lives; i++) { livesHtml += "❤"; }
    document.getElementById('lives-display').innerText = livesHtml;
}

function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}