const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "6-input-test.txt" : "6-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const ccnewline = 10;
const cca = 97;

// The obvious solution would be to split groups and then simply iterate and count over them.
// But I want to try something else :)
// const groups = inputStr.split("\n\n");

var totalSum = 0;
var dict = [];
var groupSize = 0;

for (let i = 0; i < inputStr.length; i++) {
    let c = inputStr.charCodeAt(i);
    if (c == ccnewline) {
        groupSize++;

        if (inputStr.charCodeAt(i + 1) == ccnewline) {
            addDictToSum();

            // next grp
            dict.length = 0;
            groupSize = 0;
            i++;
        }
    } else {
        let idx = c - cca;
        dict[idx] = (dict[idx] || 0) + 1;
    }
}

// Last element
groupSize++;
addDictToSum(); 

function addDictToSum() {
    totalSum += dict.reduce((prev, current) => current === groupSize ? prev + 1 : prev, 0);
}

const t1 = performance.now();

console.log("Total Sum: " + totalSum);
console.log(`Searching took ${t1 - t0}ms`)