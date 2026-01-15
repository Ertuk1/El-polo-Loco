/**
 * GameOverScreen class representing the game over screen with replay and home options.
 * Displays when the player loses the game.
 */
class GameOverScreen {
    /**
     * Initializes the game over screen with canvas and callback functions.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Object} callbacks - Object containing replay and home callback functions.
     * @param {Function} callbacks.replay - Function to call when replay is clicked.
     * @param {Function} callbacks.home - Function to call when home is clicked.
     */
    constructor(canvas, callbacks) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.onReplay = callbacks.replay;
        this.onHome = callbacks.home;
        this.replayButton = { x: 260, y: 320, width: 200, height: 60 };
        this.homeButton = { x: 260, y: 400, width: 200, height: 60 };
        this.gameOverImage = new Image();
        this.gameOverImage.src = 'IMG/9_intro_outro_screens/game_over/you lost.png';
        this.handleClick = this.handleClick.bind(this);
    }
    
    /**
     * Displays the game over screen and attaches event listeners.
     */
    show() {
        this.gameOverImage.onload = () => this.drawGameOver();
        this.drawGameOver();
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('touchstart', this.handleClick);
        this.canvas.addEventListener('mousemove', this.handleHover.bind(this));
    }
    
    /**
     * Draws the game over image and buttons on the canvas.
     */
    drawGameOver() {
        const { ctx, canvas, replayButton, homeButton } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.gameOverImage, 0, -80, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '66px zabras';
        ctx.textAlign = 'center';
        ctx.fillText('REPLAY', replayButton.x + replayButton.width / 2, replayButton.y + 38);
        ctx.fillText('HOME', homeButton.x + homeButton.width / 2, homeButton.y + 38);
    }
    
    /**
     * Handles mouse hover to change cursor when over buttons.
     * @param {MouseEvent} event - The mouse move event.
     */
    handleHover(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0].clientY) - rect.top;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;
        if (
            (canvasX >= this.replayButton.x &&
            canvasX <= this.replayButton.x + this.replayButton.width &&
            canvasY >= this.replayButton.y &&
            canvasY <= this.replayButton.y + this.replayButton.height) ||
            (canvasX >= this.homeButton.x &&
            canvasX <= this.homeButton.x + this.homeButton.width &&
            canvasY >= this.homeButton.y &&
            canvasY <= this.homeButton.y + this.homeButton.height)
        ) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }
    
    /**
     * Handles click and touch events on buttons.
     * @param {Event} event - The click or touch event.
     */
    handleClick(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0].clientY) - rect.top;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;
        if (
            canvasX >= this.replayButton.x &&
            canvasX <= this.replayButton.x + this.replayButton.width &&
            canvasY >= this.replayButton.y &&
            canvasY <= this.replayButton.y + this.replayButton.height
        ) {
            this.startReplay();
        } else if (
            canvasX >= this.homeButton.x &&
            canvasX <= this.homeButton.x + this.homeButton.width &&
            canvasY >= this.homeButton.y &&
            canvasY <= this.homeButton.y + this.homeButton.height
        ) {
            this.goHome();
        }
    }
    
    /**
     * Starts a new game by recreating the canvas and calling the replay callback.
     */
    startReplay() {
        const newCanvas = recreateCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.onReplay(newCanvas);
    }
    
    /**
     * Returns to the home screen by recreating the canvas and calling the home callback.
     */
    goHome() {
        const newCanvas = recreateCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.onHome(newCanvas);
    }
}