const TEST = false;

const fs = require("fs");

// could be done via readline, but requires more code to be transformed into an array =)
const file = TEST ? "3-input-test.txt" : "3-input.txt";
const inputStr = fs.readFileSync(file, "utf-8");
const lines = inputStr.replace("\r", "").split("\n");

const lineLength = lines[0].length;

const stepSizes = [1, 3];

var steps = 0;
var treesEncountered = 0;
for (let line = 0; line < lines.length; line += stepSizes[0]) {
    let currentPosInLine = (steps * stepSizes[1]) % lineLength;

    if (lines[line][currentPosInLine] == "#")
        treesEncountered++;
    steps++;
}

console.log("Lines wandered: " + steps);
console.log("Trees encountered: " + treesEncountered);
