let canvas;
let world;
let keyboard = new Keyboard();
let startScreen;

function recreateCanvas() {
    const container = document.getElementById('game-container');

    // Remove old canvas if it exists
    const oldCanvas = document.getElementById('canvas');
    if (oldCanvas) oldCanvas.remove();

    // Create new canvas
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'canvas';
    newCanvas.width = 720;
    newCanvas.height = 480;

    container.appendChild(newCanvas);

    return newCanvas;
}


// === Global Mute Control ===
let GLOBAL_MUTE = false;
const originalPlay = HTMLMediaElement.prototype.play;

HTMLMediaElement.prototype.play = function (...args) {
    if (GLOBAL_MUTE) {
        this.muted = true;
        this.pause();
        this.currentTime = 0; // optional: reset
        return Promise.resolve();
    } else {
        this.muted = false;
        return originalPlay.apply(this, args);
    }
};


window.onload = function () {
    initStartScreen();
};

function initStartScreen() {
    canvas = document.getElementById('canvas');
    startScreen = new StartScreen(canvas, startGame);
    startScreen.show();
}

function startGame(newCanvas) {
    canvas = recreateCanvas();
    initlevel1();
    world = new World(canvas, keyboard);
}

/**
 * Recreates a new canvas inside the game container and returns it.
 * This wipes all previous game state, sounds, and intervals.
 */
function recreateCanvas() {
    const container = document.getElementById('gameContainer');
    container.innerHTML = '<canvas id="canvas" width="720" height="480"></canvas>';
    canvas = document.getElementById('canvas');
    return canvas;
}

window.addEventListener("keydown", (e) => {
    if(e.keyCode == 39){
        keyboard.RIGHT = true;
    }
    if(e.keyCode == 37){
        keyboard.LEFT = true;
    }
    if(e.keyCode == 38){
        keyboard.UP = true;
    }
    if(e.keyCode == 40){
        keyboard.DOWN = true;
    }
    if(e.keyCode == 32){
        keyboard.SPACE = true;
    }
    if(e.keyCode == 68){
        keyboard.D = true;
    }
    
    

})
window.addEventListener("keyup", (e) => {
    if(e.keyCode == 39){
        keyboard.RIGHT = false;
    }
    if(e.keyCode == 37){
        keyboard.LEFT = false;
    }
    if(e.keyCode == 38){
        keyboard.UP = false;
    }
    if(e.keyCode == 40){
        keyboard.DOWN = false;
    }
    if(e.keyCode == 32){
        keyboard.SPACE = false;
    }
    if(e.keyCode == 68){
        keyboard.D = false;
    }
    

})