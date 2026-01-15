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
    constructor(canvas, onClick) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.onClick = onClick;
        
        this.buttonConfig = {
            x: 0.88,
            y: 0.175,
            size: 0.04
        };
        
        this.handleClick = this.handleClick.bind(this);
        this.handleTouch = this.handleTouch.bind(this);
        canvas.addEventListener('click', this.handleClick);
        canvas.addEventListener('touchstart', this.handleTouch);
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
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const canvasX = (event.clientX - rect.left) * scaleX;
        const canvasY = (event.clientY - rect.top) * scaleY;
        const btn = this.getButtonPx();
        const hitSize = btn.size * 1.5;
        const offset = (hitSize - btn.size) / 2;
        
        if (
            canvasX >= btn.x - offset &&
            canvasX <= btn.x + btn.size + offset &&
            canvasY >= btn.y - offset &&
            canvasY <= btn.y + btn.size + offset
        ) {
            this.onClick();
        }
    }
    
    /**
     * Handles touch events on the pause button for mobile devices.
     * @param {TouchEvent} event - The touch event.
     */
    handleTouch(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const touch = event.touches[0];
        const canvasX = (touch.clientX - rect.left) * scaleX;
        const canvasY = (touch.clientY - rect.top) * scaleY;
        const btn = this.getButtonPx();
        const hitSize = btn.size * 1.5;
        const offset = (hitSize - btn.size) / 2;
        
        if (
            canvasX >= btn.x - offset &&
            canvasX <= btn.x + btn.size + offset &&
            canvasY >= btn.y - offset &&
            canvasY <= btn.y + btn.size + offset
        ) {
            this.onClick();
        }
    }
    
    /**
     * Removes event listeners for cleanup.
     */
    remove() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleTouch);
    }
}