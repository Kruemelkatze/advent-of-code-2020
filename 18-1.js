const TEST = false;
const PRINT_DBG = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "18-1-input-test.txt" : "18-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

var lines = inputStr.split("\n");
var formulas, solutions = [];


if (TEST) {
    formulas = lines.map(l => l.split(" = ")[0]);
    solutions = lines.map(l => +l.split(" = ")[1]);
} else {
    formulas = lines;
}

var sum = 0;
for (let i = 0; i < formulas.length; i++) {
    let formula = formulas[i];
    let parsed = parseFormula(formulas[i]);
    let result = executeUPN(parsed);

    if (PRINT_DBG) {
        var str = `${formula} = ${result}`;
        var solution = solutions[i];
        if (solution != null) {
            str += ` (${solution})`;
        }
        console.log(str);
        console.log(parsed.join(" "));
        console.log("");
    }

    sum += result;
}



// Modified Shunting Yard algorithm
function parseFormula(formula) {
    let outputQueue = [];
    let operatorStack = [];

    for (let c of formula) {
        switch (c) {
            case " ":
                continue;
            case "+":
            case "*":
                let op;
                for (let i = operatorStack.length - 1; i >= 0; i--) {
                    let op = operatorStack[i];
                    if (op === "(") {
                        break;
                    }
                    operatorStack.pop();
                    outputQueue.push(op);
                }
                operatorStack.push(c);
                break;
            case "(":
                operatorStack.push(c);
                break;
            case ")":
                let foundMatching = false;
                for (let i = operatorStack.length - 1; i >= 0; i--) {
                    let op = operatorStack.pop();
                    if (op === "(") {
                        foundMatching = true;
                        break
                    } else {
                        outputQueue.push(op);
                    }
                }
                if (!foundMatching) {
                    console.log("No matching ( found in " + formula);
                    return [];
                }
                break;
            default:
                let n = +c;

                if (n >= 0) {
                    outputQueue.push(n);
                }

        }
    }

    let op;
    while (op = operatorStack.pop()) {
        outputQueue.push(op);
    }

    return outputQueue;
}

function executeUPN(upnArray) {
    let stack = [];

    for (let o of upnArray) {
        switch (o) {
            case "+":
                stack.push(
                    stack.pop() + stack.pop()
                );
                break;
            case "*":
                stack.push(
                    stack.pop() * stack.pop()
                );
                break;
            default:
                stack.push(o);
                break;
        }
    }

    return stack.pop();
}



const t1 = performance.now();
console.log("Sum: " + sum);
console.log(`Searching took ${t1 - t0}ms`);