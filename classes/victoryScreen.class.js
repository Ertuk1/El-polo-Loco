/**
 * VictoryScreen class displaying the victory screen when player wins.
 * Shows victory image with replay and home options.
 */
class VictoryScreen {
    /**
     * Initializes the victory screen with canvas and callback functions.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Object} callbacks - Object containing replay and home callback functions.
     * @param {Function} callbacks.replay - Function to call when replay is clicked.
     * @param {Function} callbacks.home - Function to call when home is clicked.
     */
    constructor(canvas, callbacks) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.onReplay = callbacks.replay;
        this.onHome = callbacks.home;
        this.replayButton = {
            x: canvas.width / 2 - 100,
            y: canvas.height / 2 + 40,
            w: 200,
            h: 60
        };
        this.homeButton = {
            x: canvas.width / 2 - 100,
            y: canvas.height / 2 + 120,
            w: 200,
            h: 60
        };
        this.victoryImg = new Image();
        this.victoryImg.src = 'IMG/9_intro_outro_screens/win/won_1.png';
        this.handleClick = this.handleClick.bind(this);
    }
    
    /**
     * Displays the victory screen and attaches event listeners.
     */
    show() {
        this.victoryImg.onload = () => this.draw();
        this.draw();
        this.canvas.addEventListener("click", this.handleClick);
        this.canvas.addEventListener("touchstart", this.handleClick);
    }
    
    /**
     * Hides the victory screen and removes event listeners.
     */
    hide() {
        this.canvas.removeEventListener("click", this.handleClick);
        this.canvas.removeEventListener("touchstart", this.handleClick);
    }
    
    /**
     * Converts event coordinates to canvas coordinates accounting for scaling.
     * @param {Event} event - The mouse or touch event.
     * @returns {Object} Object with x and y properties in canvas coordinates.
     */
    getCanvasCoords(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const clientX = event.clientX || event.touches?.[0].clientX;
        const clientY = event.clientY || event.touches?.[0].clientY;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
    
    /**
     * Checks if coordinates are inside a button area.
     * @param {number} x - X-coordinate to check.
     * @param {number} y - Y-coordinate to check.
     * @param {Object} btn - Button object with position and dimensions.
     * @returns {boolean} True if coordinates are inside button.
     */
    isInside(x, y, btn) {
        return (
            x >= btn.x &&
            x <= btn.x + btn.w &&
            y >= btn.y &&
            y <= btn.y + btn.h
        );
    }
    
    /**
     * Handles click and touch events on buttons.
     * @param {Event} event - The click or touch event.
     */
    handleClick(event) {
        event.preventDefault();
        const { x, y } = this.getCanvasCoords(event);
        if (this.isInside(x, y, this.replayButton)) {
            this.hide();
            this.onReplay();
        } 
        else if (this.isInside(x, y, this.homeButton)) {
            this.hide();
            this.onHome();
        }
    }
    
    /**
     * Draws the semi-transparent overlay background.
     */
    drawOverlay() {
        this.ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draws the victory image centered on screen.
     */
    drawVictoryImage() {
        this.ctx.drawImage(
            this.victoryImg,
            this.canvas.width / 2 - 200,
            40,
            400,
            220
        );
    }
    
    /**
     * Draws a single button with text.
     * @param {Object} btn - Button object with position and dimensions.
     * @param {string} text - Text to display on the button.
     */
    drawButton(btn, text) {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "66px zabras";
        this.ctx.fillText(text, this.canvas.width / 2, btn.y + 40);
    }
    
    /**
     * Draws the complete victory screen with all elements.
     */
    draw() {
        this.drawOverlay();
        this.drawVictoryImage();
        this.drawButton(this.replayButton, "Replay");
        this.drawButton(this.homeButton, "Home");
    }
}