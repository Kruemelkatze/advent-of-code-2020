const { performance } = require('perf_hooks');

const TEST = false;
const PRINT_DBG = false;

const input = TEST
    ? `.#.
..#
###`
    : `##...#.#
#..##..#
..#.####
.#..#...
########
######.#
.####..#
.###.#..`;

const startSizeXY = TEST ? 3 : 8;

const t0 = performance.now();

class Sparse4DGrid {
    gridX = new Map();

    get(x, y, z, w) {
        var gridY = this.gridX.get(x);
        if (!gridY) {
            gridY = new Map();
            this.gridX.set(x, gridY);

            let gridZ = new Map();
            gridY.set(y, gridZ);

            let gridW = new Map();
            gridZ.set(z, gridW);

            return false;
        }

        var gridZ = gridY.get(y);
        if (!gridZ) {
            let gridZ = new Map();
            gridY.set(y, gridZ);

            let gridW = new Map();
            gridZ.set(z, gridW);

            return false;
        }

        let gridW = gridZ.get(z);
        if (!gridW) {
            let gridW = new Map();
            gridZ.set(z, gridW);

            return false;
        }

        return gridW.get(w) || false;
    }

    set(x, y, z, w, value) {
        var gridY = this.gridX.get(x);
        if (!gridY) {
            gridY = new Map();
            this.gridX.set(x, gridY);

            let gridZ = new Map();
            gridY.set(y, gridZ);

            let gridW = new Map();
            gridZ.set(z, gridW);
            gridW.set(w, value);
            return;
        }

        var gridZ = gridY.get(y);
        if (!gridZ) {
            gridZ = new Map();
            gridY.set(y, gridZ);

            let gridW = new Map();
            gridZ.set(z, gridW);
            gridW.set(w, value);
        } else {
            let gridW = gridZ.get(z);

            if (!gridW) {
                gridW = new Map();
                gridZ.set(z, gridW);
                gridW.set(w, value);
            } else {
                gridW.set(w, value);
            }
        }

    }

    iterate(iterator) {
        this.gridX.forEach((gridY, x, mapX) => {
            gridY.forEach((gridZ, y, mapY) => {
                gridZ.forEach((gridW, z, mapZ) => {
                    gridW.forEach((valueW, w, mapW) => {
                        iterator(x, y, z, w, valueW);
                    })
                })
            })
        })
    }
}

var grid = new Sparse4DGrid();
var step = 0;
setInitialState(input);
// printGrid(0, 0, 3);

simulate(++step);
// printGrid(-step, step, startSizeXY + step);

simulate(++step);
simulate(++step);
simulate(++step);
simulate(++step);
simulate(++step);

var active = countActive();

function simulate() {
    let newGrid = new Sparse4DGrid();
    for (let x = -step; x < startSizeXY + step; x++) {
        for (let y = -step; y < startSizeXY + step; y++) {
            for (let z = -step; z <= step; z++) {
                for (let w = -step; w <= step; w++) {
                    let value = grid.get(x, y, z, w);
                    if (value) {
                        let neighbours = countNeighbours(x, y, z, w);
                        value = neighbours == 2 || neighbours == 3;
                    } else {
                        let neighbours = countNeighbours(x, y, z, w);
                        value = neighbours == 3;
                    }

                    newGrid.set(x, y, z, w, value);
                }
            }
        }
    }

    grid = newGrid;
}

function countActive() {
    let cnt = 0;
    grid.iterate((x, y, z, w, value) => cnt += value ? 1 : 0);
    return cnt;
}

function countNeighbours(ax, ay, az, aw, maxCount = 4) {
    var neighbours = 0;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                for (let w = -1; w <= 1; w++) {
                    if (x == 0 && y == 0 && z == 0 && w == 0)
                        continue;

                    if (grid.get(ax + x, ay + y, az + z, aw + w)) {
                        neighbours++;

                        if (neighbours >= maxCount)
                            return neighbours;
                    }
                }
            }
        }
    }

    return neighbours;
}

function logMapElements(value, key, map) {
    console.log(`m[${key}] = ${value}`);
}

function setInitialState(fullstr) {
    let lines = fullstr.split("\n");
    for (let x = 0; x < lines.length; x++) {
        let line = lines[x];
        for (let y = 0; y < line.length; y++) {
            let isSet = line.charAt(y) == "#";
            grid.set(x, y, 0, 0, isSet);
        }
    }
}

const t1 = performance.now();
console.log("Active " + active);
console.log(`Searching took ${t1 - t0}ms`);