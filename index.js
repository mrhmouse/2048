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

function GameUI(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
}

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

GameUI.prototype.drawState = function(state) {
    this.ctx.fillStyle = this.tileFillStyle(0)
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    let w = this.canvas.width / state.tiles.length
    let h = this.canvas.height / state.tiles[0].length
    state.tiles.forEach((row, y) => {
	row.forEach((tile, x) => {
	    this.ctx.fillStyle = this.tileFillStyle(tile)
	    this.ctx.fillRect(x*w, y*h, w, h)
	    this.ctx.font = this.tileFont(tile, w)
	    this.ctx.fillStyle = this.textFillStyle(tile)
	    let [dx, dy] = this.textOffset(tile, w, h)
	    this.ctx.fillText(tile, dx+(x*w), dy+(y*h), w)
	})
    })
}

GameUI.tileFillStyles = [
    [0, '#000'],
    [2, '#333'],
    [4, '#663'],
    [8, '#636'],
    [16, '#366'],
    [32, '#993'],
    [64, '#939'],
    [128, '#399'],
    [256, '#bb6'],
    [512, '#b6b'],
    [1024, '#6bb'],
    [2048, '#ee9'],
    [4096, '#e9e'],
    [4096, '#9ee'],
    [8192, '#fff'],
    [16384, '#ff0']
]

GameUI.prototype.tileFillStyle = function(tile) {
    let match = GameUI.tileFillStyles.find(s => tile <= s[0])
    if (match) return match[1]
    return GameUI.tileFillStyles[0][1]
}

GameUI.textFillStyles = [
    [1024, '#eee'],
    [16384, '#333']
]
GameUI.prototype.textFillStyle = function(tile) {
    let match = GameUI.textFillStyles.find(s => tile <= s[0])
    if (match) return match[1]
    return GameUI.textFillStyles[0][1]
}

GameUI.prototype.tileFont = function(tile, w) {
    if (tile < 100) return `${w/2}px monospace`
    else return `${w/3}px monospace`
}

GameUI.prototype.textOffset = function(tile, w, h) {
    if (tile < 10) return [w/3, (2*h)/3]
    else if (tile < 100) return [w/4, (2*h)/3]
    else if (tile < 1000) return [w/4, (3*h)/5]
    else if (tile < 10000) return [w/8, (3*h)/5]
    else return [0, (3*h)/5]
}
