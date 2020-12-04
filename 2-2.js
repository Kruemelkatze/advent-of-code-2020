const fs = require("fs");

// could be done via readline, but requires more code to be transformed into an array =)
const inputStr = fs.readFileSync("2-input.txt", "utf-8");
const input = inputStr.split("\r\n"); // Watch out in Unix systems!

const regex = /(?<pos1>\d+)-(?<pos2>\d+) (?<char>.): (?<pw>.+)$/;

var validCount = 0;
for (const str of input) {
    let match = str.match(regex);
    let { pos1, pos2, char, pw } = match.groups;

    if ((pw[pos1 - 1] === char) != (pw[pos2 - 1] === char))
        validCount++;
}

console.log("Valid PWs: " + validCount);
