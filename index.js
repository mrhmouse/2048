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
	break
    case 'ArrowUp':
	state.slideUp()
	state.combineUp()
	state.slideUp()
	break
    case 'ArrowLeft':
	state.slideLeft()
	state.combineLeft()
	state.slideLeft()
	break
    case 'ArrowRight':
	state.slideRight()
	state.combineRight()
	state.slideRight()
	break
    }
})
document.addEventListener('keyup', event => {
    if (pressing === event.key)
	pressing = false
})
render()
