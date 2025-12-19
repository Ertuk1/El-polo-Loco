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

function preloadAssets(canvas, callback) {
    const ctx = canvas.getContext('2d');
    const images = [
        'IMG/9_intro_outro_screens/start/startscreen_2.png',
        'IMG/9_intro_outro_screens/game_over/you lost.png',
        'IMG/9_intro_outro_screens/win/won_1.png',
        'IMG/muteButtons/icons8-ton-67.png',
        'IMG/muteButtons/icons8-ton-stummschalten-67.png',
        'IMG/2_character_pepe/1_idle/idle/I-1.png',
        'IMG/2_character_pepe/2_walk/W-21.png',
        'IMG/2_character_pepe/3_jump/J-31.png',
        'IMG/2_character_pepe/4_hurt/H-41.png',
        'IMG/2_character_pepe/5_dead/D-51.png',
        'IMG/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'IMG/4_enemie_boss_chicken/1_walk/G1.png',
        'IMG/6_salsa_bottle/salsa_bottle.png',
        'IMG/8_coin/coin_1.png'
    ];
    let loaded = 0;
    const total = images.length;

    const drawProgress = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Loading... ${loaded}/${total}`, canvas.width / 2, canvas.height / 2);
    };

    drawProgress();

    images.forEach(src => {
        const img = new Image();
        img.onload = () => {
            loaded++;
            drawProgress();
            if (loaded === total) {
                callback();
            }
        };
        img.src = src;
    });
}

function startGame(canvas) {
    preloadAssets(canvas, () => {
        initlevel1();
        world = new World(canvas, keyboard);
    });
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