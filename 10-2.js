const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "10-input-test-2.txt" : "10-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

var numbers = inputStr.split("\n");
numbers.push("0");
numbers = numbers.map(n => +n).sort((a, b) => a - b);

const followerDict = new Array(numbers.length);
const numberFollowerDict = new Array(numbers.length);
numberFollowerDict[numbers.length - 1] = 1;

var trees = countTrees(0);

function countTrees(index) {
    var sumChildTrees = numberFollowerDict[index];
    if (sumChildTrees != null)
        return sumChildTrees;

    var followers = getFollowers(index);

    sumChildTrees = 0;
    for (let followerIndex of followers) {
        sumChildTrees += countTrees(followerIndex);
    }

    numberFollowerDict[index] = sumChildTrees;
    return sumChildTrees;
}


function getFollowers(index) {
    var followers = followerDict[index];

    if (followers)
        return followers;

    followers = [];
    var n = numbers[index];
    for (let i = index + 1; i <= index + 3 && i < numbers.length; i++) {
        let fol = numbers[i];
        if (fol > n + 3)
            break;
        followers.push(i);
    }

    followerDict[index] = followers;
    return followers;
}

const t1 = performance.now();

console.log("Combinations: " + trees);
console.log(`Searching took ${t1 - t0}ms`)