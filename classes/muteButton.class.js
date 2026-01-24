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

buttonConfig = { x: 0.944, y: 0.156, size: 0.07 };

constructor(canvas, sounds) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sounds = sounds;
    this.deviceType = window.innerWidth <= 720 ? 'mobile' : 'desktop';
    const savedMuteState = localStorage.getItem('gameMuted');
    this.isMuted = savedMuteState === 'true';
    GLOBAL_MUTE = this.isMuted;
    this.initImages();
    this.bindHandlers();
    this.initListeners();
}

initImages() {
    this.soundOnImg = new Image();
    this.soundOnImg.src = 'IMG/muteButtons/icons8-ton-67.png';
    this.soundOffImg = new Image();
    this.soundOffImg.src = 'IMG/muteButtons/icons8-ton-stummschalten-67.png';
}

bindHandlers() {
    this.handleClick = this.handleClick.bind(this);
    this.handleTouch = this.handleTouch.bind(this);
}

initListeners() {
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
     * Handles mouse click events on the mute button.
     * @param {MouseEvent} event - The mouse click event.
     */
    handleClick(event) {
        const { canvasX, canvasY } = this.getScaledClickPos(event);
        if (this.isInsideMuteHitbox(canvasX, canvasY)) {
            this.toggleMute();
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
     * Determines whether a click lies inside the mute button's enlarged hitbox.
     * @param {number} x - Scaled canvas X coordinate.
     * @param {number} y - Scaled canvas Y coordinate.
     * @returns {boolean} True if the click is inside the hitbox.
     */
    isInsideMuteHitbox(x, y) {
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
     * Handles touch events on the mute button for mobile devices.
     * @param {TouchEvent} event - The touch event.
     */
    handleTouch(event) {
        event.preventDefault();
        const { canvasX, canvasY } = this.getScaledTouchPos(event);
        if (this.isInsideMuteHitbox(canvasX, canvasY)) {
            this.toggleMute();
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
     * Toggles mute state and dispatches custom event for other audio sources.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        GLOBAL_MUTE = this.isMuted;

        localStorage.setItem('gameMuted', this.isMuted);
        document.querySelectorAll('audio').forEach(a => a.muted = this.isMuted);

        if (this.isMuted) {
            MUSIC.pause();
        } else {
            MUSIC.resume();
        }

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