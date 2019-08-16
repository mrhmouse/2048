let game = {
    state: {
	w: 6, h: 6,
	rows: [
	    [0, 0, 0, 0, 0, 0],
	    [0, 0, 0, 0, 0, 0],
	    [0, 0, 0, 0, 2, 0],
	    [0, 0, 0, 0, 0, 0],
	    [0, 0, 0, 0, 2, 0],
	    [0, 0, 0, 0, 0, 0],
	]
    },
    context: document.querySelector('canvas').getContext('2d'),
    colors: {
	0: '#000', 2: '#3cc',
	4: '#fa8', 8: '#c3c',
	16: '#48e', 32: '#e83', 64: '#3fa',
	128: '#f3a', 256: '#ff3', 512: '#a3f',
	1024: '#eda', 2048: '#ade',
    },
    draw: function() {
	this.clear(this.context)
	this.drawBackground(this.context)
	let w = this.context.canvas.width / this.state.w
	let h = this.context.canvas.height / this.state.h
	this.state.rows.forEach(
	    (row, y) => row.forEach(
		(value, x) => this.drawCell({ value, x, y, w, h })))
    },
    clear: function() {
	this.context.clearRect(
	    0, 0,
	    this.context.canvas.width,
	    this.context.canvas.height)
    },
    drawBackground: function() {
	this.context.fillStyle = '#111'
	this.context.fillRect(
	    0, 0,
	    this.context.canvas.width,
	    this.context.canvas.height)
    },
    drawCell: function(cell) {
	this.drawCellBackground(cell)
	this.drawCellForeground(cell)
    },
    drawCellBackground: function(cell) {
	this.context.fillStyle = this.colors[cell.value] || '#f0f'
	this.context.fillRect(cell.x*cell.w, cell.y*cell.h, cell.w, cell.h)
    },
    drawCellForeground: function(cell) {
	this.context.fillStyle = cell.value ? '#000' : '#fff'
	var scale = 2, dx = 0.28, dy = 0.65
	if (cell.value > 9)
	    scale = 2, dx = 0.18, dy = 0.65
	if (cell.value > 99)
	    scale = 3, dx = 0.15, dy = 0.55
	this.context.font = `${cell.w/scale}px monospace`
	this.context.fillText(
	    cell.value,
	    (cell.x + dx)*cell.w,
	    (cell.y + dy)*cell.h)
    },
    slideUp: function() {
	let {w, h, rows} = this.state
	for (var x = 0; x < w; ++x) {
	    for (var y = 0; y < h; ++y) {
		let value = rows[y][x]
		if (value) {
		    for (var j = 0; j < y; ++j) {
			if (!rows[j][x]) {
			    rows[j][x]=value
			    rows[y][x]=0
			    break
			} else if (j == y-1 && rows[j][x] == value) {
			    rows[j][x]*=2
			    rows[y][x]=0
			}
		    }
		}
	    }
	}
    },
    slideDown: function() {
	let {w, h, rows} = this.state
	for (var x = 0; x < w; ++x) {
	    for (var y = h-1; y >= 0; --y) {
		let value = rows[y][x]
		if (value) {
		    for (var j = h-1; j > y; --j) {
			if (!rows[j][x]) {
			    rows[j][x]=value
			    rows[y][x]=0
			    break
			} else if (j == y+1 && rows[j][x] == value) {
			    rows[j][x]*=2
			    rows[y][x]=0
			}
		    }
		}
	    }
	}
    },
    slideLeft: function() {
	let {w, h, rows} = this.state
	for (var y = 0; y < h; ++y) {
	    for (var x = 0; x < w; ++x) {
		let value = rows[y][x]
		if (value) {
		    for (var j = 0; j < x; ++j) {
			if (!rows[y][j]) {
			    rows[y][j]=value
			    rows[y][x]=0
			    break
			} else if (j == x-1 && rows[y][j] == value) {
			    rows[y][j]*=2
			    rows[y][x]=0
			}
		    }
		}
	    }
	}
    },
    slideRight: function() {
	let {w, h, rows} = this.state
	for (var y = 0; y < h; ++y) {
	    for (var x = w-1; x >= 0; --x) {
		let value = rows[y][x]
		if (value) {
		    for (var j = w-1; j >= x; --j) {
			if (!rows[y][j]) {
			    rows[y][j]=value
			    rows[y][x]=0
			    break
			} else if (j == x+1 && rows[y][j] == value) {
			    rows[y][j]*=2
			    rows[y][x]=0
			}
		    }
		}
	    }
	}
    },
    addTiles: function(count, value) {
	let numZeroes = this.state.rows.reduce((sum, row) => sum+row.filter(c => c == 0).length, 0)
	if (count > numZeroes)
	    return
	while (count > 0) {
	    let x = Math.floor(Math.random()*this.state.w)
	    let y = Math.floor(Math.random()*this.state.h)
	    if (this.state.rows[y][x])
		continue
	    this.state.rows[y][x] = value
	    --count
	}
    },
    onkeyup: function(event) {
	switch (event.key) {
	case 'ArrowUp':
	    this.slideUp()
	    this.addTiles(2, 2)
	    break
	case 'ArrowDown':
	    this.slideDown()
	    this.addTiles(2, 2)
	    break
	case 'ArrowLeft':
	    this.slideLeft()
	    this.addTiles(2, 2)
	    break
	case 'ArrowRight':
	    this.slideRight()
	    this.addTiles(2, 2)
	    break
	}
    },
    lastTouch: null,
    ontouchstart: function(event) {
	this.lastTouch = { x: event.screenX, y: event.screenY }
    },
    ontouchend: function(event) {
	let touch = { x: event.screenX, y: event.screenY }
	let dx = lastTouch.x - touch.x
	let dy = lastTouch.y - touch.y
	if (dx == 0 && dy == 0)
	    return
	if (Math.abs(dx) > Math.abs(dy)) {
	    // it's a horizontal move
	    if (dx > 0) {
		this.slideRight()
	    } else if (dx < 0) {
		this.slideLeft()
	    }
	} else if (dy > 0) {
	    this.slideDown()
	} else if (dy < 0) {
	    this.slideUp()
	}
	this.addTiles(2, 2)
    },
    loop: function() {
	this.draw()
	requestAnimationFrame(() => this.loop())
    },
}

'keyup touchstart touchend'.split(' ').forEach(eventName => {
    document.addEventListener(eventName, event => game['on'+eventName](event))
})
game.loop()
