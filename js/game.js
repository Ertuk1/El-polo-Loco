let canvas;
let world;
let keyboard = new Keyboard();
let startScreen;


window.onload = function () {
    initStartScreen();
};

function initStartScreen() {
    canvas = document.getElementById('canvas');
    startScreen = new StartScreen(canvas, startGame);
    startScreen.show();
}

function startGame(newCanvas) {
    canvas = newCanvas || document.getElementById('canvas');
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