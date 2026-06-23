// js/generator.js - Contiene funciones para generar y mezclar tableros de Sudoku, así como para enmascarar celdas según el nivel de dificultad.

"use strict";

// Función auxiliar para obtener un número aleatorio entre un mínimo y un máximo
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para copiar una matriz general por valor y no por referencia
// Si solo hiciéramos copy = matrix, modificar 'copy' alteraría 'matrix' en memoria
function deepCopyMatrix(matrix) {
    var copy = [];
    for (var i = 0; i < matrix.length; i++) {
        copy.push(matrix[i].slice());
    }
    return copy;
}

// Función para copiar la matriz de notas por valor y no por referencia
function deepCopyNotes(matrix) {
    var copy = [];
    for (var i = 0; i < matrix.length; i++) {
        var row = [];
        for (var j = 0; j < matrix[i].length; j++) {
            row.push(matrix[i][j].slice());
        }
        copy.push(row);
    }
    return copy;
}

// Función para mezclar el tablero base para crear uno nuevo
function shuffleSudokuMatrix() {
    var matrix = deepCopyMatrix(perfectBase);
    
    // Regla matemática de Sudoku: Podemos intercambiar dos filas SIEMPRE Y CUANDO pertenezcan a la misma banda horizontal (mismo bloque de 3x3)
    for (var i = 0; i < 5; i++) {
        var block = getRandomInt(0, 2) * 3;     // Elige bloque 0, 3 o 6 (índices de inicio)
        var r1 = block + getRandomInt(0, 2);    // Fila aleatoria 1 dentro del bloque
        var r2 = block + getRandomInt(0, 2);    // Fila aleatoria 2 dentro del bloque
        // Intercambio de variables usando una variable temporal
        var tempRow = matrix[r1];
        matrix[r1] = matrix[r2];
        matrix[r2] = tempRow;
    }
    
    // Intercambio de columnas dentro de la misma banda vertical
    for (var j = 0; j < 5; j++) {
        var cBlock = getRandomInt(0, 2) * 3;
        var c1 = cBlock + getRandomInt(0, 2);
        var c2 = cBlock + getRandomInt(0, 2);
        // A diferencia de las filas, para intercambiar columnas hay que recorrer fila por fila
        for (var r = 0; r < 9; r++) {
            var tempCol = matrix[r][c1];
            matrix[r][c1] = matrix[r][c2];
            matrix[r][c2] = tempCol;
        }
    }
    return matrix;
}

// Toma el tablero completo mezclado y lo oculta reemplazando números con ceros (0 = celda vacía)
function maskMatrix(matrix, visibleClues) {
    var masked = deepCopyMatrix(matrix);
    var cellsToRemove = 81 - visibleClues; // 81 porque es el total de celdas (9x9)
    var removed = 0;
    
    // Bucle sigue borrando celdas aleatorias hasta alcanzar el número definido por el nivel de dificultad
    while (removed < cellsToRemove) {
        var r = getRandomInt(0, 8);
        var c = getRandomInt(0, 8);
        // Solo borra si ya no estaba borrada
        if (masked[r][c] !== 0) {
            masked[r][c] = 0;
            removed++;
        }
    }
    return masked;
}