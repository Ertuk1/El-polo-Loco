let canvas;
let world;
let startScreen;
const IMAGE_PATHS = [
    // --- Start / Win / Lose Screens ---
    'IMG/9_intro_outro_screens/start/startscreen_2.png',
    'IMG/9_intro_outro_screens/game_over/you lost.png',
    'IMG/9_intro_outro_screens/win/won_1.png',

    // --- UI / Buttons ---
    'IMG/muteButtons/icons8-ton-67.png',
    'IMG/muteButtons/icons8-ton-stummschalten-67.png',

    // --- Pepe Idle ---
    'IMG/2_character_pepe/1_idle/idle/I-1.png',
    'IMG/2_character_pepe/1_idle/idle/I-2.png',
    'IMG/2_character_pepe/1_idle/idle/I-3.png',
    'IMG/2_character_pepe/1_idle/idle/I-4.png',
    'IMG/2_character_pepe/1_idle/idle/I-5.png',
    'IMG/2_character_pepe/1_idle/idle/I-6.png',
    'IMG/2_character_pepe/1_idle/idle/I-7.png',
    'IMG/2_character_pepe/1_idle/idle/I-8.png',
    'IMG/2_character_pepe/1_idle/idle/I-9.png',
    'IMG/2_character_pepe/1_idle/idle/I-10.png',

    // --- Pepe Long Idle ---
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

    // --- Pepe Walk ---
    'IMG/2_character_pepe/2_walk/W-21.png',
    'IMG/2_character_pepe/2_walk/W-22.png',
    'IMG/2_character_pepe/2_walk/W-23.png',
    'IMG/2_character_pepe/2_walk/W-24.png',
    'IMG/2_character_pepe/2_walk/W-25.png',
    'IMG/2_character_pepe/2_walk/W-26.png',

    // --- Pepe Jump ---
    'IMG/2_character_pepe/3_jump/J-31.png',
    'IMG/2_character_pepe/3_jump/J-32.png',
    'IMG/2_character_pepe/3_jump/J-33.png',
    'IMG/2_character_pepe/3_jump/J-34.png',
    'IMG/2_character_pepe/3_jump/J-35.png',
    'IMG/2_character_pepe/3_jump/J-36.png',
    'IMG/2_character_pepe/3_jump/J-37.png',
    'IMG/2_character_pepe/3_jump/J-38.png',
    'IMG/2_character_pepe/3_jump/J-39.png',

    // --- Pepe Dead ---
    'IMG/2_character_pepe/5_dead/D-51.png',
    'IMG/2_character_pepe/5_dead/D-52.png',
    'IMG/2_character_pepe/5_dead/D-53.png',
    'IMG/2_character_pepe/5_dead/D-54.png',
    'IMG/2_character_pepe/5_dead/D-55.png',
    'IMG/2_character_pepe/5_dead/D-56.png',

    // --- Pepe Hurt ---
    'IMG/2_character_pepe/4_hurt/H-41.png',
    'IMG/2_character_pepe/4_hurt/H-42.png',
    'IMG/2_character_pepe/4_hurt/H-43.png',

    // --- Normal Chicken Walk ---
    'IMG/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'IMG/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'IMG/3_enemies_chicken/chicken_normal/1_walk/3_w.png',

    // --- Normal Chicken Dead ---
    'IMG/3_enemies_chicken/chicken_normal/2_dead/dead.png',

    // --- Small Chicken Walk ---
    'IMG/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'IMG/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'IMG/3_enemies_chicken/chicken_small/1_walk/3_w.png',

    // --- Small Chicken Dead ---
    'IMG/3_enemies_chicken/chicken_small/2_dead/dead.png',

    // --- Boss Chicken Walk ---
    'IMG/4_enemie_boss_chicken/1_walk/G1.png',
    'IMG/4_enemie_boss_chicken/1_walk/G2.png',
    'IMG/4_enemie_boss_chicken/1_walk/G3.png',
    'IMG/4_enemie_boss_chicken/1_walk/G4.png',

    // --- Boss Chicken Alert ---
    'IMG/4_enemie_boss_chicken/2_alert/G5.png',
    'IMG/4_enemie_boss_chicken/2_alert/G6.png',
    'IMG/4_enemie_boss_chicken/2_alert/G7.png',
    'IMG/4_enemie_boss_chicken/2_alert/G8.png',
    'IMG/4_enemie_boss_chicken/2_alert/G9.png',
    'IMG/4_enemie_boss_chicken/2_alert/G10.png',
    'IMG/4_enemie_boss_chicken/2_alert/G11.png',
    'IMG/4_enemie_boss_chicken/2_alert/G12.png',

    // --- Boss Chicken Attack ---
    'IMG/4_enemie_boss_chicken/3_attack/G13.png',
    'IMG/4_enemie_boss_chicken/3_attack/G14.png',
    'IMG/4_enemie_boss_chicken/3_attack/G15.png',
    'IMG/4_enemie_boss_chicken/3_attack/G16.png',
    'IMG/4_enemie_boss_chicken/3_attack/G17.png',
    'IMG/4_enemie_boss_chicken/3_attack/G18.png',
    'IMG/4_enemie_boss_chicken/3_attack/G19.png',
    'IMG/4_enemie_boss_chicken/3_attack/G20.png',

    // --- Boss Chicken Hurt ---
    'IMG/4_enemie_boss_chicken/4_hurt/G21.png',
    'IMG/4_enemie_boss_chicken/4_hurt/G22.png',
    'IMG/4_enemie_boss_chicken/4_hurt/G23.png',

    // --- Boss Chicken Dead ---
    'IMG/4_enemie_boss_chicken/5_dead/G24.png',
    'IMG/4_enemie_boss_chicken/5_dead/G25.png',
    'IMG/4_enemie_boss_chicken/5_dead/G26.png',

    // --- Bottles ---
    'IMG/6_salsa_bottle/salsa_bottle.png',
    'IMG/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'IMG/6_salsa_bottle/2_salsa_bottle_on_ground.png',

    // --- Bottle Rotation ---
    'IMG/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'IMG/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'IMG/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'IMG/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',

    // --- Bottle Splash ---
    'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',

    // --- Coin ---
    'IMG/8_coin/coin_1.png',

    // --- Background ---
    'IMG/5_background/layers/air.png',
    'IMG/5_background/layers/3_third_layer/1.png',
    'IMG/5_background/layers/3_third_layer/2.png',
    'IMG/5_background/layers/2_second_layer/1.png',
    'IMG/5_background/layers/2_second_layer/2.png',
    'IMG/5_background/layers/1_first_layer/1.png',
    'IMG/5_background/layers/1_first_layer/2.png',

    // --- Statusbars (Endboss) ---
    'IMG/7_statusbars/2_statusbar_endboss/orange/orange0.png',
    'IMG/7_statusbars/2_statusbar_endboss/orange/orange20.png',
    'IMG/7_statusbars/2_statusbar_endboss/orange/orange40.png',
    'IMG/7_statusbars/2_statusbar_endboss/orange/orange60.png',
    'IMG/7_statusbars/2_statusbar_endboss/orange/orange80.png',
    'IMG/7_statusbars/2_statusbar_endboss/orange/orange100.png',

    // --- Statusbars (Bottle) ---
    'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
    'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
    'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
    'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
    'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
    'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',

    // --- Statusbars (Health) ---
    'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
    'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
    'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
    'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
    'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
    'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png',

    // --- Statusbars (Coin) ---
    'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
];

 const AUDIO_PATHS = [
    'audio/squeaky-toy-1-6059.mp3',
    'audio/bottlecrack.mp3',
    'audio/throw.mp3',
    'audio/BackgroundMusic.mp3',
    'audio/jump.mp3',
    'audio/hurtsound.mp3',
    'audio/SnoreSound.mp3',
    'audio/chicken.mp3',
    'audio/gameover.mp3',
    'audio/clucking-chicken-440624.mp3',
    'audio/running.mp3',
    'audio/collectcoin.mp3'

 ];
  
// Global image cache
const IMAGE_CACHE = {};
const AUDIO_CACHE = {};

window.onload = function () {
    canvas = document.getElementById('canvas');

    preloadAssets(canvas, () => {
        initStartScreen();
    });
};

function preloadImages(paths, onProgress, onDone) {
    let loaded = 0;
    const total = paths.length;

    paths.forEach(src => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            IMAGE_CACHE[src] = img;
            loaded++;
            onProgress();
            if (loaded === total) onDone();
        };

        img.onerror = () => {
            console.warn("Image failed:", src);
            loaded++;
            onProgress();
            if (loaded === total) onDone();
        };
    });
}

function preloadAudios(paths, onProgress, onDone) {
    let loaded = 0;
    const total = paths.length;

    paths.forEach(src => {
        const audio = new Audio();
        audio.src = src;
        audio.preload = 'auto';

        audio.addEventListener('canplaythrough', () => {
            AUDIO_CACHE[src] = audio;
            loaded++;
            onProgress();
            if (loaded === total) onDone();
        }, { once: true });

        audio.onerror = () => {
            console.warn("Audio failed:", src);
            loaded++;
            onProgress();
            if (loaded === total) onDone();
        };

        audio.load();
    });
}

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

    const total = IMAGE_PATHS.length + AUDIO_PATHS.length;
    let loaded = 0;

    const updateProgress = () => {
        loaded++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Loading... ${loaded}/${total}`, canvas.width / 2, canvas.height / 2);

        if (loaded === total) callback();
    };

    preloadImages(IMAGE_PATHS, updateProgress, () => {});
    preloadAudios(AUDIO_PATHS, updateProgress, () => {});
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
