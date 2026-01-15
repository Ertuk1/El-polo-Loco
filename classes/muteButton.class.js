/**
 * MuteButton class providing a toggleable mute button for game audio.
 * Uses percentage-based positioning to scale with canvas size.
 */
class MuteButton {
    /**
     * Initializes the mute button with event listeners and images.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Array} sounds - Optional array of sound objects to control.
     */
    constructor(canvas, sounds) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.sounds = sounds;
        this.deviceType = window.innerWidth <= 720 ? 'mobile' : 'desktop';
        
        this.buttonConfig = {
            x: 0.944,
            y: 0.156,
            size: 0.07
        };
        
        this.isMuted = GLOBAL_MUTE;
        this.soundOnImg = new Image();
        this.soundOnImg.src = 'IMG/muteButtons/icons8-ton-67.png';
        this.soundOffImg = new Image();
        this.soundOffImg.src = 'IMG/muteButtons/icons8-ton-stummschalten-67.png';
        this.handleClick = this.handleClick.bind(this);
        this.handleTouch = this.handleTouch.bind(this);
        document.addEventListener('click', this.handleClick);
        document.addEventListener('touchstart', this.handleTouch);
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
     * Draws the mute button on the canvas with appropriate icon.
     */
    draw() {
        const img = this.isMuted ? this.soundOffImg : this.soundOnImg;
        const btn = this.getButtonPx();
        this.ctx.drawImage(img, btn.x, btn.y, btn.size, btn.size);
    }
    
    /**
     * Legacy method - no longer needed with percentage-based positioning.
     */
    updatePosition() {
    }
    
    /**
     * Handles mouse click events on the mute button.
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
            this.toggleMute();
        }
    }
    
    /**
     * Handles touch events on the mute button for mobile devices.
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
            this.toggleMute();
        }
    }
    
    /**
     * Toggles mute state and dispatches custom event for other audio sources.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        GLOBAL_MUTE = this.isMuted;
        document.querySelectorAll('audio').forEach(a => a.muted = this.isMuted);
        const muteEvent = new CustomEvent('globalMuteChanged', {
            detail: { muted: this.isMuted }
        });
        document.dispatchEvent(muteEvent);
    }
    
    /**
     * Removes event listeners for cleanup.
     */
    remove() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleTouch);
    }
}