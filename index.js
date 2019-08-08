let canvas = document.querySelector('main canvas')
let ui = new GameUI(canvas)
let state = new GameState
function render() {
    ui.drawState(state)
    requestAnimationFrame(render)
}

var pressing = false
document.addEventListener('keydown', event => {
    if (pressing) return
    pressing = event.key
    switch (event.key) {
    case 'ArrowDown':
	state.slideDown()
	state.combineDown()
	state.slideDown()
	state.addTiles(2, 2)
	break
    case 'ArrowUp':
	state.slideUp()
	state.combineUp()
	state.slideUp()
	state.addTiles(2, 2)
	break
    case 'ArrowLeft':
	state.slideLeft()
	state.combineLeft()
	state.slideLeft()
	state.addTiles(2, 2)
	break
    case 'ArrowRight':
	state.slideRight()
	state.combineRight()
	state.slideRight()
	state.addTiles(2, 2)
	break
    }
})
document.addEventListener('keyup', event => {
    if (pressing === event.key)
	pressing = false
})
render()
