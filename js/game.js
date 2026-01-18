let canvas;
let world;
let startScreen;

// Global image cache
const IMAGE_CACHE = {};

window.onload = function () {
    canvas = document.getElementById('canvas');

    preloadAssets(canvas, () => {
        initStartScreen();
    });
};


function getOrCreateImage(src) {
    // Return cached image if it exists
    if (IMAGE_CACHE[src]) {
        return IMAGE_CACHE[src];
    }
    
    // Create new image and cache it
    const img = new Image();
    img.src = src;
    IMAGE_CACHE[src] = img;
    return img;
}

function recreateCanvas() {
    const container = document.getElementById('gameContainer'); // ← must match HTML

    if (!container) {
        console.error("gameContainer not found");
        return null;
    }

    const oldCanvas = container.querySelector('canvas');
    if (oldCanvas) {
        oldCanvas.remove();
    }

    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'canvas';
    newCanvas.width = 720;
    newCanvas.height = 480;

    container.appendChild(newCanvas);
    return newCanvas;
}

function startGame(canvasParam) {
    canvas = canvasParam;

    initlevel1();
    world = new PausableWorld(canvas, keyboard);
}





// === Global Mute Control ===
let GLOBAL_MUTE = false;
let GLOBAL_PAUSE = false;
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



function initStartScreen() {
    canvas = document.getElementById('canvas');
    startScreen = new StartScreen(canvas, startGame);
    startScreen.show();
}

function showStartScreen() {
    // Clean up existing world if it exists
    if (world) {
        world.stop();
        world = null;
    }
    canvas = recreateCanvas();
    startScreen = new StartScreen(canvas, startGame);
    startScreen.show();
}

function preloadAssets(canvas, callback) {
    const ctx = canvas.getContext('2d');
        const drawProgress = (loaded, total, ctx, canvas) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Loading... ${loaded}/${total}`, canvas.width / 2, canvas.height / 2);
    };

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
        'IMG/8_coin/coin_1.png',
        'IMG/5_background/layers/air.png',
        'IMG/5_background/layers/3_third_layer/2.png',
        'IMG/5_background/layers/3_third_layer/1.png',
        'IMG/5_background/layers/2_second_layer/1.png',
        'IMG/5_background/layers/2_second_layer/2.png',
        'IMG/5_background/layers/1_first_layer/1.png',
        'IMG/5_background/layers/1_first_layer/2.png',
        'IMG/2_character_pepe/1_idle/idle/I-2.png',
        'IMG/2_character_pepe/1_idle/idle/I-3.png',
        'IMG/2_character_pepe/1_idle/idle/I-4.png',
        'IMG/2_character_pepe/1_idle/idle/I-5.png',
        'IMG/2_character_pepe/1_idle/idle/I-6.png',
        'IMG/2_character_pepe/1_idle/idle/I-7.png',
        'IMG/2_character_pepe/1_idle/idle/I-8.png',
        'IMG/2_character_pepe/1_idle/idle/I-9.png',
        'IMG/2_character_pepe/1_idle/idle/I-10.png',

        'IMG/2_character_pepe/1_idle/long_idle/I-11.png',
        'IMG/2_character_pepe/1_idle/long_idle/I-12.png',
        'IMG/2_character_pepe/1_idle/long_idle/I-13.png',
        'IMG/2_character_pepe/1_idle/long_idle/I-14.png',
        'IMG/2_character_pepe/1_idle/long_idle/I-15.png',
        'IMG/2_character_pepe/1_idle/long_idle/I-16.png',
        'IMG/2_character_pepe/1_idle/long_idle/I-17.png',
        'IMG/2_character_pepe/1_idle/long_idle/I-18.png',
        'IMG/2_character_pepe/1_idle/long_idle/I-19.png',
        'IMG/2_character_pepe/1_idle/long_idle/I-20.png',

        'IMG/2_character_pepe/2_walk/W-22.png',
        'IMG/2_character_pepe/2_walk/W-23.png',
        'IMG/2_character_pepe/2_walk/W-24.png',
        'IMG/2_character_pepe/2_walk/W-25.png',
        'IMG/2_character_pepe/2_walk/W-26.png',

        'IMG/2_character_pepe/3_jump/J-32.png',
        'IMG/2_character_pepe/3_jump/J-33.png',
        'IMG/2_character_pepe/3_jump/J-34.png',
        'IMG/2_character_pepe/3_jump/J-35.png',
        'IMG/2_character_pepe/3_jump/J-36.png',
        'IMG/2_character_pepe/3_jump/J-37.png',
        'IMG/2_character_pepe/3_jump/J-38.png',
        'IMG/2_character_pepe/3_jump/J-39.png',

        'IMG/2_character_pepe/5_dead/D-52.png',
        'IMG/2_character_pepe/5_dead/D-53.png',
        'IMG/2_character_pepe/5_dead/D-54.png',
        'IMG/2_character_pepe/5_dead/D-55.png',
        'IMG/2_character_pepe/5_dead/D-56.png',

        
        'IMG/2_character_pepe/4_hurt/H-42.png',
        'IMG/2_character_pepe/4_hurt/H-43.png'
  
    ];
    
    let loaded = 0;
    const total = images.length;
    const alreadyLoaded = images.filter(src => IMAGE_CACHE[src]?.complete).length;
    
    // If all images are already loaded, skip loading
    if (alreadyLoaded === total) {
        drawProgress(loaded, total, ctx, canvas);
        setTimeout(() => callback(), 100); // Small delay for smoothness
        return;
    }


    drawProgress(loaded, total, ctx, canvas);

    images.forEach(src => {
        // Skip if already loaded and cached
        if (IMAGE_CACHE[src]?.complete) {
            loaded++;
            drawProgress(loaded, total, ctx, canvas);
            if (loaded === total) callback();
            return;
        }
        
        const img = getOrCreateImage(src);
        
        if (img.complete) {
            
            loaded++;
            drawProgress(loaded, total, ctx, canvas);
            if (loaded === total) callback();
        } else {
            img.onload = () => {
                loaded++;
                drawProgress(loaded, total, ctx, canvas);
                if (loaded === total) callback();
            };
        }
        
    });
}






function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function checkOrientation() {
    const rotateOverlay = document.getElementById('rotateOverlay');

    if (!isMobile()) {
        rotateOverlay.style.display = 'none';
        return;
    }

    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait) {
        rotateOverlay.style.display = 'flex';
    } else {
        rotateOverlay.style.display = 'none';
    }
}

// Listen for changes
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// Run once on load
window.addEventListener('load', () => {
    checkOrientation();
});
