let canvas = document.querySelector('main canvas')
let ui = new GameUI(canvas)
let state = new GameState(
    [[0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 2, 0],
     [0, 0, 0, 0, 0, 0],
     [0, 0, 0, 0, 2, 0],
     [0, 0, 0, 0, 0, 0]])
function render() {
    ui.drawState(state)
    requestAnimationFrame(render)
}
function slideDown() {
    state.slideDown()
    state.combineDown()
    state.slideDown()
    state.addTiles(2, 2)
}
function slideUp() {
    state.slideUp()
    state.combineUp()
    state.slideUp()
    state.addTiles(2, 2)
}
function slideLeft() {
    state.slideLeft()
    state.combineLeft()
    state.slideLeft()
    state.addTiles(2, 2)
}
function slideRight() {
    state.slideRight()
    state.combineRight()
    state.slideRight()
    state.addTiles(2, 2)
}

var pressing = false
var dragging = false
var lastDrag = {x: 0, y: 0}
document.addEventListener('keydown', event => {
    if (pressing) return
    pressing = event.key
    switch (event.key) {
    case 'ArrowDown':
	slideDown()
	break
    case 'ArrowUp':
	slideUp()
	break
    case 'ArrowLeft':
	slideLeft()
	break
    case 'ArrowRight':
	slideRight()
	break
    }
})
document.addEventListener('keyup', event => {
    if (pressing === event.key)
	pressing = false
})
document.addEventListener('touchstart', event => {
    if (dragging) return
    dragging = true
    let touch = event.touches[0]
    lastDrag = {x: touch.screenX, y: touch.screenY}
})
document.addEventListener('touchend', event => {
    let touch = event.touches[0]
    let drag = {x: touch.screenX, y: touch.screenY}
    let dx = lastDrag.x - drag.x
    let dy = lastDrag.y - drag.y
    if (Math.abs(dx) > Math.abs(dy)) {
	if (dx > 0)
	    slideRight()
	else if (dx < 0)
	    slideLeft()
    } else if (dy > 0)
	slideUp()
    else if (dy < 0)
	slideDown()
    dragging = false
})
render()
