const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "6-input-test.txt" : "6-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

// The obvious solution would be to split groups and then simply iterate and count over them.
// But I want to try something else :)
// const groups = inputStr.split("\n\n");

var totalSum = 0;
var set = new Set();

for (let i = 0; i < inputStr.length; i++) {
    let c = inputStr.charAt(i);
    if (c != '\n') {
        if (!set.has(c)) {
            totalSum++;
            set.add(c);
        }
    } else if (inputStr.charAt(i + 1) == '\n') {
        // next grp
        set.clear();
    }

}

const t1 = performance.now();

console.log("Total Sum: " + totalSum);
console.log(`Searching took ${t1 - t0}ms`)