const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "13-input-test.txt" : "13-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const lines = inputStr.split("\n");
// const earliest = +lines[0];

var busTimes = lines[1].split(",").map(n => n != "x" ? +n : -1);

const ns = []
const as = [];
for (let i = 0; i < busTimes.length; i++) {
    const b = busTimes[i];
    if (b == -1)
        continue;

    ns.push(b);
    as.push(i);
}

const solution = findX();
function findX() {
    let M = ns.reduce((prev, curr) => prev * curr, 1);

    let x = 0;
    for (let i = 0; i < ns.length; i++) {
        let a = as[i];
        let n = ns[i];
        let m = M / n;
        let ms = m % n;

        x += a * m * ms;
    }

    return x;
}

const t1 = performance.now();

console.log("Timestamp: " + solution)
console.log(`Searching took ${t1 - t0}ms`)