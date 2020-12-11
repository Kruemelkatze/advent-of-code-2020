const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "11-input-test.txt" : "11-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();


var currentSeats = [];
for (let i = 0; i < inputStr.length; i++) {
    let element = inputStr.charAt(i);
    switch (element) {
        case 'L':
            currentSeats.push(0);
            break
        case '.':
            currentSeats.push(NaN);
            break;
    }
}

const lineLength = inputStr.indexOf("\n");
const numberLines = currentSeats.length / lineLength;

var tempSeats = new Array(currentSeats.length);

var totalSeatedThisTurn = 0;
var anySeatChangedThisTurn = true;

var maxIterations = 100;
var iterations = 0;


while (iterations < maxIterations && anySeatChangedThisTurn) {
    let { totalSeated, anySeatChanged } = simulate();

    totalSeatedThisTurn = totalSeated;
    anySeatChangedThisTurn = anySeatChanged;
    iterations++;
}

function simulate() {
    let totalSeated = 0;
    let anySeatChanged = false;
    for (let i = 0; i < currentSeats.length; i++) {

        let oldVal = currentSeats[i];
        let newVal = oldVal;

        if (oldVal == 0) {
            newVal = countNeighbours(i) === 0 ? 1 : 0;
            anySeatChanged = anySeatChanged || newVal != oldVal;
            totalSeated += newVal;
        } else if (oldVal == 1) {
            newVal = countNeighbours(i) < 5 ? 1 : 0;
            anySeatChanged = anySeatChanged || newVal != oldVal;
            totalSeated += newVal;
        }

        tempSeats[i] = newVal;
    }

    var temp = currentSeats;
    currentSeats = tempSeats;
    tempSeats = temp;

    return { totalSeated, anySeatChanged };
}

function countNeighbours(index) {
    let n = 0;
    n += checkDirection(index, 0, 1);
    n += checkDirection(index, 0, -1);
    n += checkDirection(index, 1, 0);
    n += checkDirection(index, -1, 0);
    n += checkDirection(index, -1, -1);
    n += checkDirection(index, 1, 1);
    n += checkDirection(index, -1, 1);
    n += checkDirection(index, 1, -1);

    return n;
}

function checkDirection(index, rowDir, colDir) {
    let { row, col } = map1to2(index);

    do {
        row += rowDir;
        col += colDir;
    } while (row >= 0 && row < numberLines && col >= 0 && col < lineLength && !(currentSeats[map2to1(row, col)] > -1))

    let occupied = row >= 0 && row < numberLines && col >= 0 && col < lineLength && currentSeats[map2to1(row, col)] == 1;
    return occupied ? 1 : 0;
}

function map1to2(index) {
    return {
        row: Math.floor(index / lineLength),
        col: index % lineLength,
    };
}

function map2to1(row, col) {
    return row * lineLength + col;
}

function printArray(array, lineLength) {
    let str = "\n";
    for (let index = 0; index < array.length; index++) {
        switch (array[index]) {
            case 1:
                str += "#";
                break;
            case 0:
                str += "L";
                break;
            default:
                str += ".";
                break;

        }

        if (index % lineLength == lineLength - 1) {
            console.log(str);
            str = ""
        }
    }
}

function countSeats(array, val = 1) {
    let cnt = 0;
    for (let i = 0; i < array.length; i++) {
        if (val == array[i]) {
            cnt++;
        }
    }

    return cnt;
}



const t1 = performance.now();

console.log(iterations + " iterations");
console.log(totalSeatedThisTurn + " active seats");
console.log(`Searching took ${t1 - t0}ms`)