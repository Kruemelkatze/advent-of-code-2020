const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "9-input-test.txt" : "9-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const preamble = TEST ? 5 : 25;
const numbers = inputStr.split("\n").map(s => +s);

const combinations = new Set();
var firstInvalid = null;
for (let i = preamble; i < numbers.length; i++) {
    getCombinations(i - preamble, i);

    let n = numbers[i];
    if (!combinations.has(n)) {
        firstInvalid = { i, n };
        break;
    }
}

function getCombinations(start, end) {
    combinations.clear();
    for (let i = start; i < end; i++) {
        for (let j = i + 1; j < end; j++) {
            combinations.add(numbers[i] + numbers[j]);
        }
    }
}

const t1 = performance.now();

if (firstInvalid) {
    console.log(`First invalid: ${firstInvalid.n} on line ${firstInvalid.i + 1}`);
} else {
    console.log("No invalid found");
}
console.log(`Searching took ${t1 - t0}ms`)