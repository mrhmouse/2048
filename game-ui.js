function GameUI(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
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
