const TEST = false;
const PRINT_DBG = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "14-2-input-test.txt" : "14-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

const lines = inputStr.split("\n");

var maskBinaryStr;
const mem = {};

for (let line of lines) {
    let [cmd, numStr] = line.split(" = ");
    if (cmd.startsWith("ma")) {
        maskBinaryStr = numStr.padStart(36, "0");
    } else {
        let adr = cmd.substr(4, cmd.length - 1 - 4);
        let adresses = getAndParseAllAdresses(maskBinaryStr, adr);

        for (let adress of adresses) {
            mem[adress] = BigInt(numStr);
        }
    }
}

var sum = BigInt(0);
for (let prop in mem) {
    sum += mem[prop];
}

function getAndParseAllAdresses(maskBinaryStr, adrString) {
    let adrBinary = dec2bin(adrString);
    let adressStrings = getAllAdresses(maskBinaryStr, adrBinary);
    return adressStrings.map(str => BigInt("0b" + str));
}

function getAllAdresses(bitmaskStr, adrString, i = 0) {
    if (i >= bitmaskStr.length)
        return [adrString];

    let ci = bitmaskStr[i];
    if (ci === 'X') {
        adrString = adrString.replaceAt(i, "0");
        let children0 = getAllAdresses(bitmaskStr, adrString, i + 1)
        adrString = adrString.replaceAt(i, "1");
        let children1 = getAllAdresses(bitmaskStr, adrString, i + 1);

        return [...children0, ...children1];
    }

    if (ci === "1") {
        adrString = adrString.replaceAt(i, "1");
    }

    return getAllAdresses(bitmaskStr, adrString, i + 1)
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2).padStart(36, "0");
}

const t1 = performance.now();
console.dir(mem);
console.log("Result: " + sum);
console.log(`Searching took ${t1 - t0}ms`)