// js/state.js - Contiene la estructura de datos que representa el estado del juego y las matrices del Sudoku.

"use strict";

// gameState almacena la información de la partida actual
var gameState = {
    playerName: "", // Nombre del jugador
    difficulty: "", // Dificultad del juego
    timeElapsed: 0, // Tiempo transcurrido, en segundos
    timerInterval: null, // Guarda la referencia al cronómetro para poder pausarlo/detenerlo
    score: 0, // Puntuación del jugador
    lives: 5, // Vidas restantes del jugador
    selectedCell: null, // Guarda qué celda del DOM está clickeada actualmente
    baseScore: 0, // Puntuación base según la dificultad
    isPaused: false, // Bandera para saber si el juego está pausado
    isNotesMode: false, // Bandera para saber si el usuario está usando el lápiz
    history: [] // Almacena estados pasados para el botón Deshacer
};

// gameData almacena exclusivamente las matrices (cuadrículas de 9x9) del juego.
var gameData = {
    solutionMatrix: [], // El tablero resuelto y correcto (100% completo)
    maskedMatrix: [], // El tablero inicial con huecos (0) según la dificultad
    userMatrix: [], // El tablero dinámico donde el usuario va ingresando números
    notesMatrix: [] // Matriz 9x9 donde cada celda es un array para notas
};

// perfectBase es un tablero de Sudoku 100% válido y resuelto
// Se utiliza como base para "mezclar" y conseguir variaciones de tableros válidos, en lugar de usar librerías externas o algoritmos complejos de generación de Sudoku
var perfectBase = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
];