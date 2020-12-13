const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "13-input-test.txt" : "13-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const lines = inputStr.split("\n");
const earliest = +lines[0];
const busses = lines[1].split(",").filter(x => x != "x").map(n => +n).sort((a, b) => b - a);

var earliestBus = -1;
var earliestBusTime = Number.MAX_SAFE_INTEGER;
for (let bus of busses) {
    let nearestDeparture = calculatedNearestDeparture(earliest, bus);
    if (nearestDeparture < earliestBusTime) {
        earliestBusTime = nearestDeparture;
        earliestBus = bus;
    }
}

function calculatedNearestDeparture(earliest, time) {
    return Math.ceil(earliest / time) * time;
}

const waitingTime = earliestBusTime - earliest;
const result = waitingTime * earliestBus;

const t1 = performance.now();

console.dir(busses);
console.log(`Bus ${earliestBus} is leaving at ${earliestBusTime}, if you arrive at ${earliest}`);
console.log(`Waiting * ID: ${waitingTime} * ${earliestBus} = ${result}`);
console.log(`Searching took ${t1 - t0}ms`)