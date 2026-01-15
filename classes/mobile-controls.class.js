/**
 * MobileControls class providing on-screen touch controls for mobile devices.
 * Displays virtual buttons for movement, jumping, and throwing actions.
 */
class MobileControls {
    /**
     * Initializes mobile controls with touch event handlers.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Keyboard} keyboard - The keyboard object to update with touch input.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.mobileControls = {
            left:  { x: 0.05, y: 0.80, w: 0.12, h: 0.12 },
            right: { x: 0.20, y: 0.80, w: 0.12, h: 0.12 },
            throw: { x: 0.70, y: 0.80, w: 0.12, h: 0.12 },
            jump:  { x: 0.85, y: 0.80, w: 0.12, h: 0.12 }
        };
        this.handleTouchStartBound = this.handleTouchStart.bind(this);
        this.handleTouchEndBound = this.handleTouchEnd.bind(this);
        this.canvas.addEventListener('touchstart', this.handleTouchStartBound);
        this.canvas.addEventListener('touchend', this.handleTouchEndBound);
    }

    /**
     * Converts button percentage coordinates to pixel coordinates.
     * @param {Object} btn - Button object with percentage-based dimensions.
     * @returns {Object} Button dimensions in pixels.
     */
    getButtonPx(btn) {
        return {
            x: btn.x * 720,
            y: btn.y * 480,
            w: btn.w * 720,
            h: btn.h * 720
        };
    }

    /**
     * Checks if touch coordinates are within a button area.
     * @param {number} x - Touch x-coordinate in canvas space.
     * @param {number} y - Touch y-coordinate in canvas space.
     * @param {Object} button - Button object to check against.
     * @returns {boolean} True if touch is within button bounds.
     */
    isInButton(x, y, button) {
        const b = this.getButtonPx(button);
        return (
            x >= b.x &&
            x <= b.x + b.w &&
            y >= b.y &&
            y <= b.y + b.h
        );
    }

    /**
     * Handles touch start events and activates corresponding keyboard keys.
     * @param {TouchEvent} e - The touch event.
     */
    handleTouchStart(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const canvasX = (touch.clientX - rect.left) * scaleX;
            const canvasY = (touch.clientY - rect.top) * scaleY;
            if (this.isInButton(canvasX, canvasY, this.mobileControls.left)) {
                this.keyboard.LEFT = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.right)) {
                this.keyboard.RIGHT = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.jump)) {
                this.keyboard.UP = true;
                this.keyboard.SPACE = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.throw)) {
                this.keyboard.D = true;
            }
        }
    }

    /**
     * Handles touch end events and updates keyboard state based on remaining touches.
     * @param {TouchEvent} e - The touch event.
     */
    handleTouchEnd(e) {
        e.preventDefault();
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.UP = false;
        this.keyboard.SPACE = false;
        this.keyboard.D = false;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const canvasX = (touch.clientX - rect.left) * scaleX;
            const canvasY = (touch.clientY - rect.top) * scaleY;
            if (this.isInButton(canvasX, canvasY, this.mobileControls.left)) {
                this.keyboard.LEFT = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.right)) {
                this.keyboard.RIGHT = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.jump)) {
                this.keyboard.UP = true;
                this.keyboard.SPACE = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.throw)) {
                this.keyboard.D = true;
            }
        }
    }

    /**
     * Draws the mobile control buttons on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        const l = this.getButtonPx(this.mobileControls.left);
        const r = this.getButtonPx(this.mobileControls.right);
        const j = this.getButtonPx(this.mobileControls.jump);
        const t = this.getButtonPx(this.mobileControls.throw);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(l.x, l.y, l.w, l.h);
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.fillRect(j.x, j.y, j.w, j.h);
        ctx.fillRect(t.x, t.y, t.w, t.h);

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('←', l.x + l.w / 2, l.y + l.h / 2);
        ctx.fillText('→', r.x + r.w / 2, r.y + r.h / 2);
        ctx.fillText('↑', j.x + j.w / 2, j.y + j.h / 2);
        ctx.fillText('D', t.x + t.w / 2, t.y + t.h / 2);
    }

    /**
     * Removes touch event listeners for cleanup.
     */
    remove() {
        this.canvas.removeEventListener('touchstart', this.handleTouchStartBound);
        this.canvas.removeEventListener('touchend', this.handleTouchEndBound);
    }
}