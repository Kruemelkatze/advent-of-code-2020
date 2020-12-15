const { performance } = require('perf_hooks');

const t0 = performance.now();

const startNumbers = [
    // [0, 3, 6],
    // [1, 3, 2],
    // [2, 1, 3],
    // [1, 2, 3],
    // [2, 3, 1],
    // [3, 2, 1],
    // [3, 1, 2],
    [5, 2, 8, 16, 18, 0, 1],
];
const results = startNumbers.map(playNumberGame);

function playNumberGame(startNumbers) {
    const lastSeen = new Map();

    startNumbers.forEach((n, i) => lastSeen.set(n, i + 1));
    var last = startNumbers[startNumbers.length - 1];

    let number = NaN;
    for (let i = startNumbers.length; i < 30000000; i++) {
        number = lastSeen.has(number) ? i - lastSeen.get(number) : 0;
        lastSeen.set(last, i);
        last = number;

        if (i % 1000000 === 0) {
            console.log(i);
        }
    }

    return last;
}

const t1 = performance.now();

for (let i = 0; i < startNumbers.length; i++) {
    console.log(`Given the starting numbers ${startNumbers[i].join(',')}, the 2020th number spoken is ${results[i]}.`)
}

console.log(`Searching took ${t1 - t0}ms`)