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

class Sparse3DGrid {
    gridX = new Map();

    get(x, y, z) {
        var gridY = this.gridX.get(x);
        if (!gridY) {
            gridY = new Map();
            this.gridX.set(x, gridY);

            gridZ = new Map();
            gridY.set(y, gridZ);
            return false;
        }

        var gridZ = gridY.get(y);
        if (!gridZ) {
            gridZ = new Map();
            gridY.set(y, gridZ);
            return false;
        }

        return gridZ.get(z) || false;
    }

    set(x, y, z, value) {
        var gridY = this.gridX.get(x);
        if (!gridY) {
            gridY = new Map();
            this.gridX.set(x, gridY);

            gridZ = new Map();
            gridY.set(y, gridZ);
            gridZ.set(z, value)
        } else {
            var gridZ = gridY.get(y);
            if (!gridZ) {
                gridZ = new Map();
                gridY.set(y, gridZ);
            }
            gridZ.set(z, value);
        }
    }

    iterate(iterator) {
        this.gridX.forEach((gridY, x, mapX) => {
            gridY.forEach((gridZ, y, mapY) => {
                gridZ.forEach((valueZ, z, mapZ) => {
                    iterator(x, y, z, valueZ);
                })
            })
        })
    }
}

var grid = new Sparse3DGrid();
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
    let newGrid = new Sparse3DGrid();


    // grid.iterate((x, y, z, value) => {
    //     //Simulate each cube
    //     let newValue;
    //     if (value) {
    //         let neighbours = countNeighbours(x, y, z);
    //         newValue = neighbours == 2 || neighbours == 3;
    //     } else {
    //         let neighbours = countNeighbours(x, y, z);
    //         newValue = neighbours == 3;
    //     }

    //     newGrid.set(x, y, z, newValue);
    // });

    // new bottom layer and top layer
    for (let x = -step; x < startSizeXY + step; x++) {
        for (let y = -step; y < startSizeXY + step; y++) {
            for (let z = -step; z <= step; z++) {
                let value = grid.get(x, y, z);
                if (value) {
                    let neighbours = countNeighbours(x, y, z);
                    value = neighbours == 2 || neighbours == 3;
                } else {
                    let neighbours = countNeighbours(x, y, z);
                    value = neighbours == 3;
                }

                newGrid.set(x, y, z, value);
            }
        }
    }


    grid = newGrid;
}

function countActive() {
    let cnt = 0;
    grid.iterate((x, y, z, value) => cnt += value ? 1 : 0);
    return cnt;
}

function countNeighbours(ax, ay, az, maxCount = 4) {
    var neighbours = 0;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                if (x == 0 && y == 0 && z == 0)
                    continue;

                if (grid.get(ax + x, ay + y, az + z)) {
                    neighbours++;

                    if (neighbours >= maxCount)
                        return neighbours;
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
            grid.set(x, y, 0, isSet);
        }
    }
}

function printGrid(minZ, maxZ, size) {
    for (let z = minZ; z <= maxZ; z++) {
        console.log("z=" + z);
        for (let x = 0; x < size; x++) {
            let str = "";
            for (let y = 0; y < size; y++) {
                str += grid.get(x, y, z) ? "#" : '.';
            }
            console.log(str);
        }
    }

    console.log();
}

const t1 = performance.now();
console.log("Active " + active);
console.log(`Searching took ${t1 - t0}ms`);