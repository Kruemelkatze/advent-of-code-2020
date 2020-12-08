const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "8-input-test.txt" : "8-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const commands = inputStr.split("\n");
var acc = 0;
const visited = new Set();

var i = 0;
while (i < commands.length) {
    if (visited.has(i))
        break;

    visited.add(i);
    let cmd = commands[i];

    let nextInstruction = 1;
    switch (cmd.charAt(0)) {
        case "a":
            acc += +cmd.substring(4);
            break;
        case "j":
            nextInstruction = +cmd.substring(4);
            break;
    }

    i += nextInstruction;
}

const t1 = performance.now();

console.log("Acc: " + acc);
console.log(`Searching took ${t1 - t0}ms`)