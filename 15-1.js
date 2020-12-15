const { performance } = require('perf_hooks');

const t0 = performance.now();

const startNumbers = [
    [0, 3, 6],
    [1, 3, 2],
    [2, 1, 3],
    [1, 2, 3],
    [2, 3, 1],
    [3, 2, 1],
    [3, 1, 2],
    [5, 2, 8, 16, 18, 0, 1],
];
const results = startNumbers.map(playNumberGame);

function playNumberGame(startNumbers) {
    const lastSeen = {};

    startNumbers.forEach((n, i) => lastSeen[n] = [i, -1]);
    var last = startNumbers[startNumbers.length - 1];

    for (let i = startNumbers.length; i < 2020; i++) {
        let number;

        let lastSeenBefore = lastSeen[last];
        let wasFirstTime = lastSeenBefore[1] == -1;
        if (wasFirstTime) {
            number = 0;
        } else {
            number = lastSeenBefore[0] - lastSeenBefore[1];
        }

        let numberLastSeen = lastSeen[number];
        if (numberLastSeen) {
            numberLastSeen[1] = numberLastSeen[0];
            numberLastSeen[0] = i;
        } else {
            lastSeen[number] = [i, -1];
        }

        last = number;
    }

    return last;
}

const t1 = performance.now();

for (let i = 0; i < startNumbers.length; i++) {
    console.log(`Given the starting numbers ${startNumbers[i].join(',')}, the 2020th number spoken is ${results[i]}.`)
}

console.log(`Searching took ${t1 - t0}ms`)