const fs = require("fs");

// could be done via readline, but requires more code to be transformed into an array =)
const inputStr = fs.readFileSync("3-input.txt", "utf-8");
const input = inputStr.split("\r\n"); // Watch out in Unix systems!

const regex = /(?<min>\d+)-(?<max>\d+) (?<char>.): (?<pw>.+)$/;

var validCount = 0;
for (const str of input) {
    let match = str.match(regex);
    let { min, max, char, pw } = match.groups;

    let charCount = countChar(pw, char);
    if (charCount >= min && charCount <= max)
        validCount++;
}

console.log("Valid PWs: " + validCount);

function countChar(str, char) {
    let cnt = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == char)
            cnt++;
    }

    return cnt;
}