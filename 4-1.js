const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "4-input-test.txt" : "4-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

var passports = inputStr.split("\n\n");
console.log("Number of passports: " + passports.length);

var validPassports = 0;
for (const passport of passports) {

    let numberOfKvp = 0;
    for (let c = 3; c < passport.length - 1; c++) {
        if (passport.charAt(c) === ":") {
            numberOfKvp++;
        }
    }

    // .includes is actually faster than everything handcrafted I came up with :D
    if (numberOfKvp > 7 || numberOfKvp == 7 && !passport.includes("cid:")) {
        validPassports++;
    }
}

const t1 = performance.now();

console.log("Valid Passports: " + validPassports);
console.log(`Filtering took ${t1 - t0}ms`)