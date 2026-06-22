"use strict";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function deepCopyMatrix(matrix) {
    var copy = [];
    for (var i = 0; i < matrix.length; i++) {
        copy.push(matrix[i].slice());
    }
    return copy;
}

function shuffleSudokuMatrix() {
    var matrix = deepCopyMatrix(perfectBase);
    
    // Intercambio de Filas dentro de bloques de 3
    for (var i = 0; i < 5; i++) {
        var block = getRandomInt(0, 2) * 3;
        var r1 = block + getRandomInt(0, 2);
        var r2 = block + getRandomInt(0, 2);
        var tempRow = matrix[r1];
        matrix[r1] = matrix[r2];
        matrix[r2] = tempRow;
    }
    // Intercambio de Columnas dentro de bloques de 3
    for (var j = 0; j < 5; j++) {
        var cBlock = getRandomInt(0, 2) * 3;
        var c1 = cBlock + getRandomInt(0, 2);
        var c2 = cBlock + getRandomInt(0, 2);
        for (var r = 0; r < 9; r++) {
            var tempCol = matrix[r][c1];
            matrix[r][c1] = matrix[r][c2];
            matrix[r][c2] = tempCol;
        }
    }
    return matrix;
}

function maskMatrix(matrix, visibleClues) {
    var masked = deepCopyMatrix(matrix);
    var cellsToRemove = 81 - visibleClues;
    var removed = 0;
    
    while (removed < cellsToRemove) {
        var r = getRandomInt(0, 8);
        var c = getRandomInt(0, 8);
        if (masked[r][c] !== 0) {
            masked[r][c] = 0;
            removed++;
        }
    }
    return masked;
}