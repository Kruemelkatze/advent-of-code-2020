const TEST = false;
const PRINT_DBG = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "16-2-input-test.txt" : "16-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const rangeRegex = /(\d+)-(\d+)/g;
const sections = inputStr.split("\n\n");
const fields = parseFields(sections[0]);
const myTicket = parseTickets(sections[1])[0];
const tickets = parseTickets(sections[2]);

const validTickets = tickets.filter(ticket => isTicketValid(ticket, fields));
calculateFieldValidities(validTickets, fields);
assignFieldPositions(fields);

const departureFields = fields.filter(f => f.name.startsWith("departure"));
const departureProduct = departureFields.reduce((prev, field) => prev * myTicket[field.assignedPosition], 1);

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

function parseTickets(fullstr) {
    let tickets = [];
    let lines = fullstr.split("\n");
    for (let i = 1; i < lines.length; i++) {
        let entries = lines[i].split(",").map(v => +v);
        tickets.push(entries);
    }

    return tickets;
}

function isTicketValid(ticket, fields) {
    return ticket.every(value => fields.some(field => checkField(field, value)));
}

function checkField(field, value) {
    return field.ranges.some(r => value >= r[0] && value <= r[1]);
}

function calculateFieldValidities(tickets, fields) {
    let ticketSize = tickets[0].length;

    for (let field of fields) {
        field.validPositions = new Set();
        for (let i = 0; i < ticketSize; i++) {
            let positionValid = true;
            for (let ticket of tickets) {
                if (!checkField(field, ticket[i])) {
                    positionValid = false;
                    break;
                }
            }

            if (positionValid) {
                field.validPositions.add(i);
            }
        }
    }
}

function assignFieldPositions(fields) {

    let changedAnything;
    do {
        changedAnything = false;

        let fieldWithOneChoice = fields.find(f => f.validPositions.size === 1);
        if (fieldWithOneChoice) {
            let pos = fieldWithOneChoice.validPositions.values().next().value;
            fieldWithOneChoice.assignedPosition = pos;

            for (let field of fields) {
                field.validPositions.delete(pos);
            }

            changedAnything = true;
        }
    } while (changedAnything);
}

const t1 = performance.now();
console.log("Departure product: " + departureProduct)
console.log(`Searching took ${t1 - t0}ms`);