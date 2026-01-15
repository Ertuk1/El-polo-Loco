/**
 * PausableWorld class extending World with pause functionality.
 * Adds pause button, pause screen, and game state management.
 * @extends World
 */
class PausableWorld extends World {
    /**
     * Initializes the pausable world with pause controls and screen.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        super(canvas, keyboard);
        this.isPaused = false;
        this.pauseButton = new PauseButton(
            this.canvas,
            () => this.togglePause()
        );
        this.pauseScreen = new PauseScreen(this.canvas, {
            resume: () => this.togglePause(),
            replay: () => this.restartGame(),
            home: () => this.goHome()
        });
        this.start();
    }

    /**
     * Restarts the game by destroying current instance and creating a new one.
     */
    restartGame() {
        GLOBAL_PAUSE = false;
        this.stop();
        const newCanvas = recreateCanvas();
        startGame(newCanvas);
    }
    
    /**
     * Returns to the home screen by destroying current game instance.
     */
    goHome() {
        GLOBAL_PAUSE = false;
        this.stop();
        const newCanvas = recreateCanvas();
        showStartScreen(newCanvas);
    }
    
    /**
     * Toggles between paused and unpaused states.
     */
    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }
    
    /**
     * Draws the game world, pause button, and pause screen overlay if paused.
     */
    draw() {
        super.draw();
        this.pauseButton.draw();
        if (this.isPaused) {
            this.pauseScreen.draw();
        }
    }
}