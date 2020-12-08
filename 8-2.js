const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "8-input-test.txt" : "8-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const nopsAndJmps = [];
const commands = inputStr.split("\n");
for (let i = 0; i < commands.length; i++) {
    let c0 = commands[i].charAt(0);
    if (c0 != "a") {
        nopsAndJmps.push(i);
    }
}

var resultAcc = 0;
for (let switchIndex of nopsAndJmps) {
    let oldCmd = switchCommand(switchIndex);
    var { acc, terminates } = execute();

    if (terminates) {
        resultAcc = acc;
        break;
    }

    commands[switchIndex] = oldCmd;
}

function switchCommand(i) {
    let cmd = commands[i];
    let c0 = cmd.charAt(0);
    let newCmd = c0 == "j" ? "nop" : "jmp";
    commands[i] = newCmd + cmd.substring(3);
    return cmd;
}

function execute() {
    var acc = 0;

    const visited = new Set();
    var i = 0;
    while (i < commands.length) {
        if (visited.has(i))
            return { acc, terminates: false };

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

    return { acc, terminates: true };
}

const t1 = performance.now();

console.log(`Terminates: ${terminates}, acc=${acc}`);
console.log(`Searching took ${t1 - t0}ms`)