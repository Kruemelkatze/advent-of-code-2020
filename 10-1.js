const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "10-input-test-2.txt" : "10-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const numbers = inputStr.split("\n").map(n => +n).sort((a, b) => a - b);
const diffs = [0, 0, 1];
var invalid;

let prev = 0;
for (let i = 0; i < numbers.length; i++) {
    let n = numbers[i];
    let d = n - prev;

    if (d > 3) {
        invalid = { n, k: prev, d };
        break;
    }

    diffs[d - 1]++;
    prev = n;
}

const t1 = performance.now();

if (invalid) {
    let { k, n, d } = invalid;
    console.log(`Found invalid chain: ${k}->${n}=${d}`);
} else {
    console.log(`Differences: ${diffs.join(',')}`)
    console.log("Result: " + (diffs[0] * diffs[2]));
}

console.log(`Searching took ${t1 - t0}ms`)