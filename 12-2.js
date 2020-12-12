const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "12-input-test.txt" : "12-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const commands = inputStr.split("\n");

const north = [0, 1];
const south = [0, -1];
const east = [1, 0];
const west = [-1, 0];

var pos = [0, 0];
var waypoint = [10, 1];

for (let command of commands) {
    let waypointMovement;

    let number = +command.substr(1);

    switch (command.charAt(0)) {
        case "N":
            waypointMovement = north;
            break;
        case "S":
            waypointMovement = south;
            break;
        case "E":
            waypointMovement = east;
            break;
        case "W":
            waypointMovement = west;
            break;
        case "L":
            waypoint = rotateVector(waypoint, number);
            break;
        case "R":
            waypoint = rotateVector(waypoint, -number);
            break;
        case "F":
            // Move ship
            pos[0] += waypoint[0] * number;
            pos[1] += waypoint[1] * number;
            break;
    }

    if (waypointMovement) {
        waypoint[0] += waypointMovement[0] * number;
        waypoint[1] += waypointMovement[1] * number;
    }

}

function rotateVector(vec, deg) {
    deg = deg % 360;
    deg = deg >= 0 ? deg : 360 + deg;

    if (deg == 0)
        return vec;

    // we only have degrees 90,180,270
    let cos = deg === 180 ? -1 : 0; // 0,-1,0
    let sin = deg === 180 ? 0 : (deg === 90 ? 1 : -1); // 1,0,-1

    let [x, y] = vec;

    return [
        x * cos - y * sin,
        x * sin + y * cos,
    ];
}

const t1 = performance.now();
console.dir(pos);
console.log("Manhattan Distance: " + (Math.abs(pos[0]) + Math.abs(pos[1])))

console.log(`Searching took ${t1 - t0}ms`)