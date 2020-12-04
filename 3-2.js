const TEST = false;

const fs = require("fs");

// could be done via readline, but requires more code to be transformed into an array =)
const file = TEST ? "3-input-test.txt" : "3-input.txt";
const inputStr = fs.readFileSync(file, "utf-8");
const lines = inputStr.replace("\r", "").split("\n");

const lineLength = lines[0].length;

const stepSizes = [
    [1, 1],
    [1, 3],
    [1, 5],
    [1, 7],
    [2, 1],
];

var treesEncountered = new Array(stepSizes.length).fill(0);
for (var s = 0; s < stepSizes.length; s++) {
    let stepSize = stepSizes[s];

    var steps = 0;
    for (let line = 0; line < lines.length; line += stepSize[0]) {
        let currentPosInLine = (steps * stepSize[1]) % lineLength;

        if (lines[line][currentPosInLine] == "#")
            treesEncountered[s]++;
        steps++;
    }

    console.log("Lines wandered: " + steps);
    console.log("Trees encountered: " + treesEncountered[s]);
}

var result = treesEncountered.reduce((prev, curr) => prev * curr, 1);
console.log("Result: " + result);

