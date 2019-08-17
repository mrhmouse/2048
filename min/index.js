let mutations = {
    slideUp({ w, h, rows }) {
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
    slideDown({ w, h, rows }) {
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
    slideLeft({ w, h, rows }) {
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
    slideRight({ w, h, rows }) {
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
    addTiles(count, value) {
	return function({ w, h, rows }) {
	    let numZeroes = rows.reduce(
		(sum, row) => sum+row.filter(c => c == 0).length, 0)
	    if (count > numZeroes)
		return
	    while (count > 0) {
		let x = Math.floor(Math.random()*w)
		let y = Math.floor(Math.random()*h)
		if (rows[y][x])
		    continue
		rows[y][x] = value
		--count
	    }
	}
    },
}
let events = {
    keyup(event) {
	switch (event.key) {
	case 'ArrowUp': return [
	    mutations.slideUp,
	    mutations.addTiles(2, 2)]
	case 'ArrowDown': return [
	    mutations.slideDown,
	    mutations.addTiles(2, 2)]
	case 'ArrowLeft': return [
	    mutations.slideLeft,
	    mutations.addTiles(2, 2)]
	case 'ArrowRight': return [
	    mutations.slideRight,
	    mutations.addTiles(2, 2)]
	}
    },
}
let ui = {
    context: document.querySelector('canvas').getContext('2d'),
    colors: {
	0: '#000', 2: '#3cc',
	4: '#fa8', 8: '#c3c',
	16: '#48e', 32: '#e83', 64: '#3fa',
	128: '#f3a', 256: '#ff3', 512: '#a3f',
	1024: '#eda', 2048: '#ade',
    },
    draw(state) {
	let w = this.context.canvas.width / state.w
	let h = this.context.canvas.height / state.h
	this.clear(this.context)
	this.drawBackground(this.context)
	state.rows.forEach((row, y) => {
	    row.forEach((value, x) => {
		this.drawCell({ value, x, y, w, h })
	    })
	})
    },
    clear() {
	this.context.clearRect(
	    0, 0,
	    this.context.canvas.width,
	    this.context.canvas.height)
    },
    drawBackground() {
	this.context.fillStyle = '#111'
	this.context.fillRect(
	    0, 0,
	    this.context.canvas.width,
	    this.context.canvas.height)
    },
    drawCell(cell) {
	this.drawCellBackground(cell)
	this.drawCellForeground(cell)
    },
    drawCellBackground(cell) {
	this.context.fillStyle = this.colors[cell.value] || '#f0f'
	this.context.fillRect(cell.x*cell.w, cell.y*cell.h, cell.w, cell.h)
    },
    drawCellForeground(cell) {
	this.context.fillStyle = cell.value ? '#000' : '#fff'
	// lol manual positioning
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
}
let state = {
    w: 6, h: 6,
    rows: [
	[0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 2, 0],
	[0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 2, 0],
	[0, 0, 0, 0, 0, 0]]
}
let game = {
    state, ui,
    updateQueue: [],
    update() {
	while (this.updateQueue.length)
	    this.updateQueue.shift().call(null, this.state)
    },
    loop() {
	this.update()
	this.ui.draw(this.state)
	requestAnimationFrame(() => this.loop())
    },
    registerEvents(events) {
	for (let [name, handler] of Object.entries(events)) {
	    document.addEventListener(name, event => {
		for (let mutation of handler(event) || [])
		    this.updateQueue.push(mutation)
	    })
	}
    },
}
game.registerEvents(events)
game.loop()
