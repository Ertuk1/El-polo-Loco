/**
 * PauseScreen class displaying a pause menu overlay with resume and home options.
 * Shows semi-transparent overlay over the paused game.
 */
class PauseScreen  {
    /**
     * Initializes the pause screen with canvas and action callbacks.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Object} actions - Object containing action callback functions.
     * @param {Function} actions.resume - Function to call when resume is clicked.
     * @param {Function} actions.home - Function to call when home is clicked.
     */
    constructor(canvas, actions) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.actions = actions;
        this.resumeButton = { x: 260, y: 200, w: 200, h: 60 };
        this.homeButton = { x: 260, y: 280, w: 200, h: 60 };
        this.handleClick = this.handleClick.bind(this);
        const rect = this.canvas.getBoundingClientRect();
const scaleX = this.canvas.width / rect.width;
const scaleY = this.canvas.height / rect.height;

const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
const y = (event.clientY || event.touches?.[0].clientY) - rect.top;

const canvasX = x * scaleX;
const canvasY = y * scaleY;

    }
    
    /**
     * Displays the pause screen and attaches event listeners.
     */
    show() {
        this.draw();
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('touchstart', this.handleClick);
    }
    
    /**
     * Hides the pause screen and removes event listeners.
     */
    hide() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleClick);
    }
    
    /**
     * Draws the pause screen overlay with buttons.
     */
    draw() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawButton(this.resumeButton, 'Resume');
        this.drawButton(this.homeButton, 'Home');
    }
    
    /**
     * Draws a single button with text.
     * @param {Object} btn - Button object with position and dimensions.
     * @param {string} text - Text to display on the button.
     */
    drawButton(btn, text) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '36px zabras';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, btn.x + btn.w / 2, btn.y + 42);
    }
    
    /**
     * Handles click and touch events on buttons.
     * @param {Event} e - The click or touch event.
     */
    handleClick(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
        const hit = (b) =>
            x >= b.x && x <= b.x + b.w &&
            y >= b.y && y <= b.y + b.h;
        if (hit(this.resumeButton)) this.actions.resume();
        if (hit(this.homeButton)) this.actions.home();
    }
}