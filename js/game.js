let canvas;
let world;
let startScreen;
let GLOBAL_MUTE = false;
let AUDIO_UNLOCKED = false;
const savedMuteState = localStorage.getItem('gameMuted');
if (savedMuteState !== null) {
    GLOBAL_MUTE = savedMuteState === 'true';
}

/**
 * Waits for the user's first click to unlock audio playback.
 * Returns a promise that resolves after user interaction or rejects after timeout.
 * @returns {Promise<void>} Resolves when audio can safely be played.
 */

function soundIsReady() {
    return new Promise((resolve, reject) => {
        const to = setTimeout(() => {
            reject('User didnt interact. Sound cannot be played.');
        }, 1000 * 100);

        document.addEventListener('click', () => {
            clearTimeout(to);
            setTimeout(resolve, 10);
        }, { once: true });
    });
}


// Global image cache
const IMAGE_CACHE = {};
const AUDIO_CACHE = {};

/**
 * Initializes the game once the window has fully loaded.
 * Retrieves the canvas element and begins preloading all assets.
 */

window.onload = function () {
    canvas = document.getElementById('canvas');

    preloadAssets(canvas, () => {
        initStartScreen();
    });
};


/**
 * Preloads all image files and stores them in the global IMAGE_CACHE.
 * Calls progress and completion callbacks during loading.
 * @param {string[]} paths - List of image file paths to load.
 * @param {Function} onProgress - Called after each image finishes loading.
 * @param {Function} onDone - Called when all images have been processed.
 */

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

/**
 * Preloads all audio files and stores them in the global AUDIO_CACHE.
 * Uses canplaythrough to ensure audio is fully buffered.
 * @param {string[]} paths - List of audio file paths to load.
 * @param {Function} onProgress - Called after each audio finishes loading.
 * @param {Function} onDone - Called when all audio files have been processed.
 */

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

/**
 * Retrieves an image from the cache or creates and caches it if missing.
 * Ensures images are reused instead of reloaded.
 * @param {string} src - Path to the image file.
 * @returns {HTMLImageElement} The cached or newly created image object.
 */

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

/**
 * Removes the existing canvas and creates a fresh one inside the game container.
 * Used when restarting the game or returning to the start screen.
 * @returns {HTMLCanvasElement|null} The newly created canvas or null if container missing.
 */

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
    canvas.style.width = "100%";
    canvas.style.height = "auto";

    container.appendChild(newCanvas);
    return newCanvas;
}

/**
 * Starts the actual gameplay by initializing the level and world.
 * Waits for user interaction before enabling audio playback.
 * @param {HTMLCanvasElement} canvasParam - The canvas used for rendering the game.
 */

async function startGame(canvasParam) {
    canvas = canvasParam;

    initlevel1();
    world = new PausableWorld(canvas, keyboard);

    await soundIsReady();   // wait for user interaction
    AUDIO_UNLOCKED = true;
    MUSIC.stop();
    MUSIC.play();           // now guaranteed to work
}



// === Global Mute Control ===
let GLOBAL_PAUSE = false;
const originalPlay = HTMLMediaElement.prototype.play;
/**
 * Overrides the default play() behavior to enforce global mute and audio unlock rules.
 * Prevents audio from playing until user interaction has occurred.
 * @param {...any} args - Arguments passed to the original play() function.
 * @returns {Promise<void>} A resolved promise when muted or locked, otherwise the original play promise.
 */

HTMLMediaElement.prototype.play = function (...args) {
    if (GLOBAL_MUTE) {
        this.muted = true;
        this.pause();
        this.currentTime = 0;
        return Promise.resolve();
    }
    this.muted = false;
    return AUDIO_UNLOCKED
        ? originalPlay.apply(this, args)
        : Promise.resolve();
};


/**
 * Creates and displays the game's start screen.
 * Initializes a new StartScreen instance and renders it.
 */

function initStartScreen() {
    canvas = document.getElementById('canvas');
    startScreen = new StartScreen(canvas, startGame);
    startScreen.show();
}

/**
 * Returns the game to the start screen.
 * Stops the current world, recreates the canvas, and shows the start menu again.
 */

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

/**
 * Preloads all images and audio while displaying a loading progress indicator.
 * Calls the provided callback once all assets are fully loaded.
 * @param {HTMLCanvasElement} canvas - Canvas used to draw the loading progress.
 * @param {Function} callback - Called when all assets have finished loading.
 */

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

    preloadImages(IMAGE_PATHS, updateProgress, () => { });
    preloadAudios(AUDIO_PATHS, updateProgress, () => { });
}

/**
 * Detects whether the current device is a mobile device based on the user agent.
 * @returns {boolean} True if the device is mobile.
 */

function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Checks the device orientation and displays or hides the rotate overlay.
 * Ensures mobile users rotate their device for proper gameplay.
 */

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

/**
 * Listens for screen size or orientation changes and updates the rotate overlay accordingly.
 */

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

/**
 * Performs an initial orientation check when the page finishes loading.
 */

window.addEventListener('load', () => {
    checkOrientation();
});
