class PausableWorld extends World {
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

    restartGame() {
    GLOBAL_PAUSE = false;
    this.stop();          // fully destroy
    const newCanvas = recreateCanvas();
    startGame(newCanvas); // create fresh world
}

goHome() {
    GLOBAL_PAUSE = false;
    this.stop();
    const newCanvas = recreateCanvas();
    showStartScreen(newCanvas);
}


togglePause() {
    if (this.isPaused) {
        this.resume();
    } else {
        this.pause();
    }
}



draw() {
    // Don't return early - let the parent draw first
    super.draw();
    
    // Draw pause button on top
    this.pauseButton.draw();
    
    // If paused, draw pause screen overlay
    if (this.isPaused) {
        this.pauseScreen.draw();
    }
}

}
