const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "4-2-input-test.txt" : "4-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

var passports = inputStr.split("\n\n");
console.log("Number of passports: " + passports.length);

var regexp = /(...):([^\r\n :]+)/gm;
var hclRegex = /^#[0-9a-f]{6}$/;
var eclSet = new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]);
var pidRegex = /^[0-9]{9}$/;

var validPassports = 0;
for (var passport of passports) {
    let matches = [];
    let cidFound = false;
    let match;
    while ((match = regexp.exec(passport)) != null) {
        matches.push(match);
        cidFound = cidFound || match[1] == "cid";
    }

    if (matches.length < 7 || matches.length == 7 && cidFound) {
        continue;
    }

    let valid = checkPassportValidity(matches);
    if (valid) {
        validPassports++;
    }
}

function checkPassportValidity(matches) {
    for (let kvp of matches) {
        let value = kvp[2];
        let valid;
        switch (kvp[1]) {
            case "byr":
                valid = checkRange(value, 1920, 2002);
                break;
            case "iyr":
                valid = checkRange(value, 2010, 2020);
                break;
            case "eyr":
                valid = checkRange(value, 2020, 2030);
                break;
            case "hgt":
                valid = checkHeight(value);
                break;
            case "hcl":
                valid = checkHairColor(value);
                break;
            case "ecl":
                valid = checkEyeColor(value);
                break;
            case "pid":
                valid = checkPid(value);
                break;
            default:
                valid = true;
        }

        if (!valid)
            return false;
    }
    return true;
}

function checkRange(val, min, max) {
    let num = +val;
    return num >= min && num <= max;
}

function checkHeight(val) {
    let num = val.substring(0, val.length - 2)
    return val.endsWith("cm") ? checkRange(num, 150, 193) : checkRange(num, 59, 76);
}

function checkHairColor(val) {
    return hclRegex.test(val);
}

function checkEyeColor(val) {
    return eclSet.has(val);
}

function checkPid(val) {
    return pidRegex.test(val);
}

const t1 = performance.now();

console.log("Valid Passports: " + validPassports);
console.log(`Filtering took ${t1 - t0}ms`)