function padRight(array, length, value) {
    while (array.length < length)
	array.push(value)
    return array
}
function padLeft(array, length, value) {
    while (array.length < length)
	array.unshift(value)
    return array
}
function rotateRight(grid) {
    let h = grid.length - 1
    return grid.map((row, y) => row.map((s, x) => grid[h-x][y]))
}
function rotateLeft(grid) {
    let w = grid[0].length - 1
    return grid.map((row, y) => row.map((s, x) => grid[x][w-y]))
}
function isNonZero(s) {
    return s !== 0
}
function isZero(s) {
    return s === 0
}
function countZeroes(array) {
    return array.filter(isZero).length
}
function sum(array, f) {
    return array.reduce((sum, x) => sum+f(x), 0)
}
