const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "5-input-test.txt" : "5-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const rowBits = 7;
const seatBits = 3;

var max = Number.MIN_SAFE_INTEGER;
const lines = inputStr.split("\n");

for (let line of lines) {
    let row = getNumberThroughBinaryConversion(line, 0, rowBits, 'B');
    let seat = getNumberThroughBinaryConversion(line, rowBits, seatBits, 'R');

    let id = row * 8 + seat;

    if (id > max) {
        max = id;
    }
}

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

console.log("Max: " + max);
console.log(`Searching took ${t1 - t0}ms`)