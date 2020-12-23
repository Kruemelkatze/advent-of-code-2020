const TEST = false;
const PRINT_DBG = true;

const fs = require("fs");
const { performance } = require('perf_hooks');
console.log("TEST: " + TEST)
const file = TEST ? "19-1-input-test.txt" : "19-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const sections = inputStr.split("\n\n");
const rulesStrings = sections[0].split("\n");
const messages = sections[1].split("\n");

const ruleStringsLookup = parseRuleStringLookup(rulesStrings);
console.log(ruleStringsLookup.size);
const rules = parseRules(ruleStringsLookup);
console.log(rules.size);

var r0 = rules.get("0");
var matchingMessages = messages.filter(m => messageMatchesRule(m, r0)).length;

function parseRuleStringLookup(strings) {
    let ruleStringMap = new Map();
    for (let string of strings) {
        let [id, ruleStr] = string.split(": ");
        ruleStringMap.set(id, ruleStr);
    }

    return ruleStringMap;
}

function parseRules(ruleStringsLookup) {
    let rules = new Map();
    let keys = ruleStringsLookup.keys();
    for (let id of keys) {
        parseRule(id, rules, ruleStringsLookup);
    }

    return rules;
}

function parseRule(id, rules, ruleStringsLookup) {
    let prevEntry = rules.get(id);
    if (prevEntry) {
        return prevEntry;
    }

    let ruleStr = ruleStringsLookup.get(id);

    let rule = [];
    let alternatives = ruleStr.split(" | ");
    for (let alternative of alternatives) {
        if (alternative.startsWith('"')) {
            let altRule = alternative.substring(1, alternative.length - 1);
            rule.push(altRule);
        } else {
            let subRuleSplit = alternative.split(" ");
            let subRuleVariations = subRuleSplit.map(
                subRuleId => parseRule(subRuleId, rules, ruleStringsLookup)
            );
            let altRules = getSubRuleVariations(subRuleVariations);
            rule.push(...altRules);
        }
    }

    rules.set(id, rule);

    return rule;
}

function getSubRuleVariations(subRuleVariations) {
    if (subRuleVariations.length == 1)
        return subRuleVariations[0];

    let [current, ...rest] = subRuleVariations;
    let restVariations = getSubRuleVariations(rest);

    let variations = [];
    for (let c of current) {
        for (let v of restVariations) {
            variations.push(c + v);
        }
    }

    return variations;
}

function messageMatchesRule(message, rule) {
    return rule.some(r => r === message);
}


const t1 = performance.now();
console.log("Matching messages: " + matchingMessages);
console.log(`Searching took ${t1 - t0}ms`);