const { performance } = require('perf_hooks');
const target = 2020;

var input = [1010, 1736, 1711, 1803, 1825, 1268, 1651, 2007, 1923, 1661, 1788, 1876, 2003, 1752, 1988, 1955, 1568, 1478, 1699, 1717, 1828, 1636, 1387, 1870, 1658, 1572, 1703, 1185, 1569, 1515, 1142, 1407, 1587, 1608, 1827, 1546, 1808, 1937, 1815, 1957, 1401, 1763, 1970, 1960, 1853, 1987, 1865, 1567, 1664, 1961, 1771, 1846, 1971, 1416, 1897, 633, 1708, 1606, 515, 1397, 1873, 1374, 1969, 1918, 1170, 1660, 1494, 1764, 2002, 1938, 1396, 1926, 1714, 1659, 1805, 1593, 1899, 1850, 1644, 1877, 1561, 1895, 1985, 1353, 395, 1919, 1522, 1745, 1721, 901, 1765, 1939, 2009, 1949, 1852, 1792, 1749, 1675, 1883, 1240, 1868, 1615, 1693, 1720, 1388, 1325, 1337, 867, 1751, 1408, 1715, 1942, 1706, 1894, 1260, 1945, 1700, 1148, 1373, 351, 1790, 1861, 1755, 1155, 1622, 1743, 1872, 1979, 1262, 1789, 1305, 1311, 1729, 1929, 823, 1623, 2005, 1932, 1814, 1909, 1728, 1592, 1712, 1363, 1338, 1804, 1402, 1198, 264, 1117, 1791, 1419, 1229, 1924, 1838, 1785, 1982, 1683, 1950, 1199, 1984, 1830, 1921, 1980, 1834, 1341, 1282, 1989, 1854, 1395, 1847, 1900, 1913, 1777, 1779, 1333, 1800, 1966, 1543, 1882, 1375, 1811, 1673, 1679, 889, 1670, 1879, 1312, 1741, 1772, 1663, 1776, 1642, 1674, 1472, 1580, 1264, 1738, 1999, 1637];

const t0 = performance.now();
input = input.sort((a, b) => a - b);

var solution;
const min = input[0];
const m2 = min * 2;
out_of_here: for (let i = 0; i < input.length; i++) {
    let one = input[i];
    if (one + m2 >= target)
        continue;


    for (let j = i + 1; j < input.length; j++) {
        let two = input[j];
        if (one + two + min >= target)
            continue;

        var validThree = recursiveSearch(input, (three) => target - one - two - three, 0, input.length - 1);

        if (validThree) {
            solution = [one, two, validThree];
            break out_of_here;
        }
    }
}

function recursiveSearch(arr, compareFunc, start, end) {
    if (start > end)
        return null;

    let mid = Math.floor((start + end) / 2);
    let compareVal = compareFunc(arr[mid]);

    if (compareVal == 0)
        return arr[mid];
    else if (compareVal > 0)
        return recursiveSearch(arr, compareFunc, mid + 1, end)
    else
        return recursiveSearch(arr, compareFunc, start, mid - 1);
}

const t1 = performance.now();

if (solution && solution.length) {
    console.log(`${solution[0]} + ${solution[1]} + ${solution[2]}= 2020`);
    console.log(solution[0] * solution[1] * solution[2]);
} else {
    console.log("No solution found.")
}

console.log(`Search took ${t1 - t0}ms`)