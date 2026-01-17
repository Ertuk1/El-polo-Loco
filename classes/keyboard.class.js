/**
 * Keyboard class tracking the pressed state of game control keys.
 * Used to handle player input for movement and actions.
 */
// Update your Keyboard class
class Keyboard {
    constructor() {
        this.keys = {};
    }
}


let keyboard = new Keyboard();


window.addEventListener('keydown', (e) => {

    const gameKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' ', 'd', 'D'];
    if (gameKeys.includes(e.key)) {
        e.preventDefault();
    }
    

    switch(e.key) {
        case 'ArrowRight':
        case 'Right':
            keyboard.RIGHT = true;
            break;
        case 'ArrowLeft':
        case 'Left':
            keyboard.LEFT = true;
            break;
        case 'ArrowUp':
        case 'Up':
            keyboard.UP = true;
            break;
        case 'ArrowDown':
        case 'Down':
            keyboard.DOWN = true;
            break;
        case ' ':
            keyboard.SPACE = true;
            break;
        case 'd':
        case 'D':
            keyboard.D = true;
            break;
    }
});


window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowRight':
        case 'Right':
            keyboard.RIGHT = false;
            break;
        case 'ArrowLeft':
        case 'Left':
            keyboard.LEFT = false;
            break;
        case 'ArrowUp':
        case 'Up':
            keyboard.UP = false;
            break;
        case 'ArrowDown':
        case 'Down':
            keyboard.DOWN = false;
            break;
        case ' ':
            keyboard.SPACE = false;
            break;
        case 'd':
        case 'D':
            keyboard.D = false;
            break;
    }
});