const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "7-input-test.txt" : "7-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

// RULES
const ruleRegex = /(?<cnt>\d+) (?<bag>[^\d,.]+) bag/gm;
const containsDict = {};
const containedByDict = {};

const lines = inputStr.split("\n");
for (let line of lines) {
    let split = line.split(" bags contain ");

    let rules = split[1];
    if (rules.startsWith("no"))
        continue;

    let containerBag = split[0];

    let container = containsDict[containerBag];
    if (container == null) {
        container = containsDict[containerBag] = {};
    }

    let match;
    while ((match = ruleRegex.exec(rules)) != null) {
        let bag = match.groups.bag;
        let cnt = +match.groups.cnt
        container[bag] = cnt;

        let containedByEntry = containedByDict[bag];
        if (containedByEntry == null) {
            containedByEntry = containedByDict[bag] = {};
        }
        containedByEntry[containerBag] = cnt;
    }
}

// LOOKUP
const target = "shiny gold";

var cache = {};
var count = countContainedBags(target);

function countContainedBags(entryId) {
    var cnt = 1;
    var entry = containsDict[entryId];

    if (!entry)
        return cnt;

    for (let bagId in entry) {
        let entryCnt = entry[bagId];

        let containedBags = cache[bagId] || countContainedBags(bagId);
        cnt += entryCnt * containedBags;
    }

    cache[entryId] = cnt;
    return cnt;
}

count--; // Don't count root

const t1 = performance.now();


console.log("Count: " + count);
console.log(`Searching took ${t1 - t0}ms`)