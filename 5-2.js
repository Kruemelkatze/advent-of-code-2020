const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "5-input-test.txt" : "5-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const seats = new Array(128);
for (let i = 0; i < seats.length; i++) {
    seats[i] = new Array(8).fill(" ");
}

const t0 = performance.now();

const rowBits = 7;
const seatBits = 3;
var maxId = Number.MIN_VALUE, minId = Number.MAX_VALUE;

var sum = 0;

const lines = inputStr.split("\n");
for (let line of lines) {
    let row = getNumberThroughBinaryConversion(line, 0, rowBits, 'B');
    let seat = getNumberThroughBinaryConversion(line, rowBits, seatBits, 'R');

    let id = row * 8 + seat;
    sum += id;

    if (id > maxId) {
        maxId = id;
    }

    if (id < minId) {
        minId = id;
    }

    seats[row][seat] = "X";
}

const n = minId - 1;
const targetSum = (maxId * maxId + maxId) / 2 - (n * n + n) / 2
var missingId = targetSum - sum;

function getNumberThroughBinaryConversion(line, start, bits, charSymbolizingOne) {
    // could be done via line.substr(...).reduce(...), but it would look nasty

    let num = 0;
    let offset = start + bits - 1;
    for (let pot = 0; pot < bits; pot++) {
        let char = line.charAt(offset - pot);
        num += char == charSymbolizingOne ? 1 << pot : 0;
    }

    return num;
}

const t1 = performance.now();

for (let i = 0; i < seats.length; i++) {
    console.log(seats[i].join("") + ":" + i);
}



console.log("Missing id: " + missingId);
console.log(`Searching took ${t1 - t0}ms`)