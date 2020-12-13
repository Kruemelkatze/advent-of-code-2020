const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "13-input-test.txt" : "13-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const lines = inputStr.split("\n");
// const earliest = +lines[0];

var busTimes = lines[1].split(",").map(n => n != "x" ? +n : -1);

var maxBusTime = Number.MIN_SAFE_INTEGER;
var maxBusTimeIndex = -1;
for (let i = 0; i < busTimes.length; i++) {
    const b = busTimes[i];
    if (b > maxBusTime) {
        maxBusTime = b;
        maxBusTimeIndex = i;
    }
}

var kgv = 1;
const busses = [];
for (let i = 0; i < busTimes.length; i++) {
    const b = busTimes[i];
    if (b == -1 || b == maxBusTime)
        continue;

    kgv *= b;
    busses.push({ step: b, offset: i - maxBusTimeIndex });
}

const earliest = TEST ? 0 : 100000000000000;
const max = earliest + kgv;

var allMatch = false;
var i = Math.floor(earliest / maxBusTime) * maxBusTime;

while (!allMatch && i < max) {
    allMatch = true;
    for (let bus of busses) {
        let timeDiff = calculateDepartureDifferance(i, bus.step, bus.offset > 0)
        if (timeDiff !== bus.offset) {
            allMatch = false;
            break;
        }
    }

    if (!allMatch) {
        i += maxBusTime;
    }
}

var timestamp = i + busses[0].offset;

function calculateDepartureDifferance(relativeTo, busTime, greater) {
    let dep = greater
        ? Math.ceil(relativeTo / busTime) * busTime
        : Math.floor(relativeTo / busTime) * busTime;

    return dep - relativeTo;
}

const t1 = performance.now();

console.dir(busTimes);
console.log("Timestamp: " + timestamp)
console.log(`Searching took ${t1 - t0}ms`)