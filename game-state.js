function GameState(initialState) {
    this.turn = 0
    this.tiles = initialState ||
	[[0, 0, 0, 0],
	 [0, 0, 2, 0],
	 [0, 0, 0, 0],
	 [0, 0, 2, 0]]
}
GameState.prototype.slideLeft = function() {
    this.tiles = this.tiles.
	map(row => padRight(row.filter(isNonZero), row.length, 0))
}
GameState.prototype.slideRight = function() {
    this.tiles = this.tiles.
	map(row => padLeft(row.filter(isNonZero), row.length, 0))
}
GameState.prototype.slideUp = function() {
    this.tiles = rotateRight(this.tiles)
    this.slideRight()
    this.tiles = rotateLeft(this.tiles)
}
GameState.prototype.slideDown = function() {
    this.tiles = rotateRight(this.tiles)
    this.slideLeft()
    this.tiles = rotateLeft(this.tiles)
}
GameState.prototype.combineLeft = function() {
    this.tiles.forEach(row => {
	for (let x = 0; x < row.length-1; ++x) {
	    if (row[x] === row[x+1]) {
		row[x] += row[x+1]
		row[x+1] = 0
	    }
	}
    })
}
GameState.prototype.combineRight = function() {
    this.tiles.forEach(row => {
	for (let x = row.length-1; x > 0; --x) {
	    if (row[x] === row[x-1]) {
		row[x] += row[x-1]
		row[x-1] = 0
	    }
	}
    })
}
GameState.prototype.combineUp = function() {
    this.tiles = rotateRight(this.tiles)
    this.combineRight()
    this.tiles = rotateLeft(this.tiles)
}
GameState.prototype.combineDown = function() {
    this.tiles = rotateRight(this.tiles)
    this.combineLeft()
    this.tiles = rotateLeft(this.tiles)
}
GameState.prototype.addTiles = function(count, value) {
    let numZeroes = sum(this.tiles, countZeroes)
    if (numZeroes < count)
	return false
    while (count > 0) {
	let y = Math.floor(Math.random() * this.tiles.length)
	let x = Math.floor(Math.random() * this.tiles[0].length)
	if (this.tiles[y][x] === 0) {
	    --count
	    this.tiles[y][x] = value
	}
    }
    return true
}
