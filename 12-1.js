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

const movementDirections = [north, west, south, east];

var pos = [0, 0];
var facingDirection = east;

for (let command of commands) {
    let movementDirection;

    let number = +command.substr(1);

    switch (command.charAt(0)) {
        case "N":
            movementDirection = north;
            break;
        case "S":
            movementDirection = south;
            break;
        case "E":
            movementDirection = east;
            break;
        case "W":
            movementDirection = west;
            break;
        case "L":
            facingDirection = changeFacingDirection(facingDirection, number);
            break;
        case "R":
            facingDirection = changeFacingDirection(facingDirection, -number);
            break;
        case "F":
            movementDirection = facingDirection;
            break;
    }

    if (movementDirection) {
        pos[0] += movementDirection[0] * number;
        pos[1] += movementDirection[1] * number;
    }
}

function changeFacingDirection(current, degrees) {
    let turns = degrees / 90;
    while (turns < 0) {
        turns += movementDirections.length;
    }

    let pos = movementDirections.indexOf(current);
    pos = (pos + turns) % movementDirections.length;
    return movementDirections[pos];
}


const t1 = performance.now();
console.dir(pos);
console.log("Manhattan Distance: " + (Math.abs(pos[0]) + Math.abs(pos[1])))

console.log(`Searching took ${t1 - t0}ms`)