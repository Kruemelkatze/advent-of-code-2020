const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "9-input-test.txt" : "9-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const preamble = TEST ? 5 : 25;
const numbers = inputStr.split("\n").map(s => +s);

var current = new Set(numbers.slice(0, preamble));

var firstInvalid;
for (let i = preamble; i < numbers.length; i++) {
    let n = numbers[i];
    let foundPairForNumber = false;

    for (let c of current) {
        if (c == 2 * n)
            continue;

        let diff = n - c;
        if (current.has(diff)) {
            foundPairForNumber = true;
            break;
        }
    }

    if (!foundPairForNumber) {
        firstInvalid = { i, n };
        break;
    }
    current.delete(numbers[i - preamble]);
    current.add(n);
}

const t1 = performance.now();

if (firstInvalid) {
    console.log(`First invalid: ${firstInvalid.n} on line ${firstInvalid.i + 1}`);
} else {
    console.log("No invalid found");
}
console.log(`Searching took ${t1 - t0}ms`)