const TEST = false;
const PRINT_DBG = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "14-input-test.txt" : "14-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const lines = inputStr.split("\n");

const digits = 0b11111111111111111111111111111111111111111111111111111;

var bitmask0 = 0;
var bitmask1 = 0;

const mem = {};

for (let line of lines) {
    let [cmd, numStr] = line.split(" = ");
    if (cmd.startsWith("ma")) {
        readBitmaskStr(numStr);
    } else {
        let adr = cmd.substr(4, cmd.length - 1 - 4);
        writeToMem(adr, BigInt(numStr));
    }
}

var sum = BigInt(0);
for (let prop in mem) {
    sum += mem[prop];
}

function readBitmaskStr(bitmaskStr) {
    bitmask0 = BigInt(0);
    bitmask1 = BigInt(0);

    for (let i = 0; i < bitmaskStr.length; i++) {
        let c = bitmaskStr.charAt(bitmaskStr.length - 1 - i);
        switch (c) {
            case 'X':
                continue;
            case '1':
                bitmask1 |= BigInt(1) << BigInt(i);
                break;
            default:
                bitmask0 |= BigInt(1) << BigInt(i);
                break;
        }
    }

    bitmask0 = ~bitmask0;
    bitmask1 = bitmask1;

    if (PRINT_DBG) {
        console.log("bitmask str: " + bitmaskStr)
        console.log("bitmask0 : " + dec2bin(bitmask0));
        console.log("bitmask1 : " + dec2bin(bitmask1));
        console.log();
    }
}

function applyBitmask(num) {
    // bitmask0 is inverted
    return num & bitmask0 | bitmask1;
}

function writeToMem(adr, num) {
    var masked = applyBitmask(num);
    mem[adr] = masked;

    if (PRINT_DBG) {
        console.log(`Writing to [${adr}]\n\tvalue: ${dec2bin(num)}\n\tresult:${dec2bin(masked)}`);
    }
}


function dec2bin(dec) {
    return (dec >>> 0).toString(2).padStart(36, "0");
}

const t1 = performance.now();
console.dir(mem);
console.log("Result: " + sum);
console.log(`Searching took ${t1 - t0}ms`)