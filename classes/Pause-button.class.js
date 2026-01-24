/**
 * PauseButton class providing a pause button for the game.
 * Uses percentage-based positioning to match mute button styling.
 */
class PauseButton {
    /**
     * Initializes the pause button with event listeners.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Function} onClick - Callback function when button is clicked.
     */
    /**
     * button touch points 
     */
    buttonConfig = {
            x: 0.88,
            y: 0.175,
            size: 0.04
        };


    constructor(canvas, onClick) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.onClick = onClick
        this.handleClick = this.handleClick.bind(this);
        this.handleTouch = this.handleTouch.bind(this);
        this.initListeners();
    }
    /**
     * init eventlisteners for click handling pause button
     */
initListeners() {
    this.canvas.addEventListener('click', this.handleClick, { passive: false });
    this.canvas.addEventListener('touchstart', this.handleTouch, { passive: false });
    this.canvas.addEventListener('mousemove', this.handleHover.bind(this), {passive: false});
}

/**
 * checks hover for pause or mute
 * @param {MouseEvent|TouchEvent} event - Mouse-/Touch‑Event
 */
handleHover(event) {
  const { canvasX, canvasY } = this.getScaledClickPos(event);
  const pauseHover = this.isInsidePauseHitbox(canvasX, canvasY);
  const m = { x: 0.944 * this.canvas.width, y: 0.156 * this.canvas.height, size: 0.07 * this.canvas.width };
  const o = (m.size * 1.5 - m.size) / 2;
  const muteHover = canvasX >= m.x - o && canvasX <= m.x + m.size + o && canvasY >= m.y - o && canvasY <= m.y + m.size + o;
  this.canvas.style.cursor = (pauseHover || muteHover) ? "pointer" : "default";
}


    /**
     * Converts button percentage coordinates to pixel coordinates.
     * @returns {Object} Button dimensions in pixels.
     */
    getButtonPx() {
        return {
            x: this.buttonConfig.x * 720,
            y: this.buttonConfig.y * 480,
            size: this.buttonConfig.size * 720
        };
    }

    /**
     * Draws the pause button with two vertical bars symbol.
     */
    draw() {
        const btn = this.getButtonPx();

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(btn.x, btn.y, btn.size, btn.size);

        this.ctx.fillStyle = 'white';
        const barWidth = btn.size * 0.25;
        const barHeight = btn.size * 0.6;
        const barY = btn.y + btn.size * 0.2;
        const spacing = btn.size * 0.15;

        this.ctx.fillRect(btn.x + spacing, barY, barWidth, barHeight);
        this.ctx.fillRect(btn.x + btn.size - spacing - barWidth, barY, barWidth, barHeight);
    }

    /**
     * Handles mouse click events on the pause button.
     * @param {MouseEvent} event - The mouse click event.
     */
    handleClick(event) {
        const { canvasX, canvasY } = this.getScaledClickPos(event);
        if (this.isInsidePauseHitbox(canvasX, canvasY)) {
            this.onClick();
        }
    }

    /**
     * Converts a mouse click position into scaled canvas coordinates.
     * @param {MouseEvent} event - The mouse click event.
     * @returns {{canvasX: number, canvasY: number}} Scaled canvas coordinates.
     */
    getScaledClickPos(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            canvasX: (event.clientX - rect.left) * scaleX,
            canvasY: (event.clientY - rect.top) * scaleY
        };
    }

    /**
     * Determines whether a click lies inside the pause button's enlarged hitbox.
     * @param {number} x - Scaled canvas X coordinate.
     * @param {number} y - Scaled canvas Y coordinate.
     * @returns {boolean} True if the click is inside the hitbox.
     */
    isInsidePauseHitbox(x, y) {
        const btn = this.getButtonPx();
        const hitSize = btn.size * 1.5;
        const offset = (hitSize - btn.size) / 2;

        return (
            x >= btn.x - offset &&
            x <= btn.x + btn.size + offset &&
            y >= btn.y - offset &&
            y <= btn.y + btn.size + offset
        );
    }


    /**
 * Handles touch events on the pause button for mobile devices.
 * @param {TouchEvent} event - The touch event.
 */
    handleTouch(event) {
        event.preventDefault();
        const { canvasX, canvasY } = this.getScaledTouchPos(event);
        if (this.isInsidePauseHitbox(canvasX, canvasY)) {
            this.onClick();
        }
    }

    /**
     * Converts the first touch position into scaled canvas coordinates.
     * @param {TouchEvent} event - The touch event.
     * @returns {{canvasX: number, canvasY: number}} Scaled canvas coordinates.
     */
    getScaledTouchPos(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const touch = event.touches[0];

        return {
            canvasX: (touch.clientX - rect.left) * scaleX,
            canvasY: (touch.clientY - rect.top) * scaleY
        };
    }

    /**
     * Determines whether a touch lies inside the pause button's enlarged hitbox.
     * @param {number} x - Scaled canvas X coordinate.
     * @param {number} y - Scaled canvas Y coordinate.
     * @returns {boolean} True if the touch is inside the hitbox.
     */
    isInsidePauseHitbox(x, y) {
        const btn = this.getButtonPx();
        const hitSize = btn.size * 1.5;
        const offset = (hitSize - btn.size) / 2;

        return (
            x >= btn.x - offset &&
            x <= btn.x + btn.size + offset &&
            y >= btn.y - offset &&
            y <= btn.y + btn.size + offset
        );
    }


    /**
     * Removes event listeners for cleanup.
     */
    remove() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleTouch);
    }
}