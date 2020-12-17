const TEST = false;
const PRINT_DBG = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "16-input-test.txt" : "16-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const rangeRegex = /(\d+)-(\d+)/g;
const sections = inputStr.split("\n\n");
const fields = parseFields(sections[0]);
const tickets = parseNearbyTickets(sections[2]);

const errorRate = calculateTicketScanningErrorRate(tickets, fields);

function calculateTicketScanningErrorRate(tickets, fields) {
    let sum = 0;
    for (let ticket of tickets) {
        let invalidFields = getInvalidTicketFields(ticket, fields);
        sum += sumArray(invalidFields);
    }
    return sum;
}

function sumArray(arr) {
    return arr.reduce((prev, v) => prev + v, 0);
}

function parseFields(fullstr) {
    let fields = [];
    let lines = fullstr.split("\n");
    for (let line of lines) {
        let name = line.substring(0, line.indexOf(":"));

        let ranges = [];
        let rangeMatch;
        while ((rangeMatch = rangeRegex.exec(line)) != null) {
            ranges.push([+rangeMatch[1], +rangeMatch[2]]);
        }

        fields.push({
            name, ranges
        });
    }

    return fields;
}

function parseNearbyTickets(fullstr) {
    let tickets = [];
    let lines = fullstr.split("\n");
    for (let i = 1; i < lines.length; i++) {
        let entries = lines[i].split(",").map(v => +v);
        tickets.push(entries);
    }

    return tickets;
}

function getInvalidTicketFields(ticket, fields) {
    var faultyValues = ticket.filter(value => !fields.some(f => f.ranges.some(r => value >= r[0] && value <= r[1])));
    return faultyValues;
}

const t1 = performance.now();
console.log("Error rate: " + errorRate);
console.log(`Searching took ${t1 - t0}ms`);