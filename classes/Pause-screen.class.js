/**
 * PauseScreen class displaying a pause menu overlay with resume and home options.
 * Shows semi-transparent overlay over the paused game.
 */
class PauseScreen {
    /**
     * Initializes the pause screen with canvas and action callbacks.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Object} actions - Object containing action callback functions.
     * @param {Function} actions.resume - Function to call when resume is clicked.
     * @param {Function} actions.home - Function to call when home is clicked.
     */
    resumeButton = { x: 260, y: 200, w: 200, h: 60 };
    homeButton = { x: 260, y: 280, w: 200, h: 60 };

    constructor(canvas, actions) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.actions = actions;
        this.handleClick = this.handleClick.bind(this);

    }

        /**
     * Updates the cursor style when hovering over pause menu buttons.
     * @param {MouseEvent} event - Mouse movement event.
     */
    handleHover(event) {
        const { x, y } = this.getScaledPointerPos(event);

        const hover =
            this.isInsideButton(x, y, this.resumeButton) ||
            this.isInsideButton(x, y, this.homeButton);

        this.canvas.style.cursor = hover ? 'pointer' : 'default';
    }


    /**
     * Displays the pause screen and attaches event listeners.
     */
    show() {
        this.draw();
        this.canvas.addEventListener('click', this.handleClick, { passive: false });
        this.canvas.addEventListener('touchstart', this.handleClick, { passive: false });
        this.canvas.addEventListener('mousemove', this.handleHover.bind(this));

    }

    /**
     * Hides the pause screen and removes event listeners.
     */
    hide() {
        this.canvas.removeEventListener('click', this.handleClick, { passive: false });
        this.canvas.removeEventListener('touchstart', this.handleClick, { passive: false });
        this.canvas.removeEventListener('mousemove', this.handleHover);
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

        const { x, y } = this.getScaledPointerPos(e);

        if (this.isInsideButton(x, y, this.resumeButton)) this.actions.resume();
        if (this.isInsideButton(x, y, this.homeButton)) this.actions.home();
    }

    /**
     * Converts a mouse or touch event into scaled canvas coordinates.
     * @param {Event} e - The click or touch event.
     * @returns {{x: number, y: number}} Scaled canvas coordinates.
     */
    getScaledPointerPos(e) {
        const rect = this.canvas.getBoundingClientRect();

        const clientX = e.clientX ?? e.touches?.[0]?.clientX;
        const clientY = e.clientY ?? e.touches?.[0]?.clientY;

        if (clientX == null || clientY == null) return { x: -1, y: -1 };

        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    /**
     * Checks whether a pointer coordinate lies inside a button's rectangular area.
     * @param {number} x - Scaled canvas X coordinate.
     * @param {number} y - Scaled canvas Y coordinate.
     * @param {{x:number, y:number, w:number, h:number}} btn - The button to test.
     * @returns {boolean} True if the pointer is inside the button.
     */
    isInsideButton(x, y, btn) {
        return (
            x >= btn.x &&
            x <= btn.x + btn.w &&
            y >= btn.y &&
            y <= btn.y + btn.h
        );
    }


}