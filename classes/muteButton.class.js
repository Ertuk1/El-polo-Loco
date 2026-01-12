class MuteButton {
    constructor(canvas, sounds) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.sounds = sounds; // optional: pass in game sounds later
        this.deviceType = window.innerWidth <= 720 ? 'mobile' : 'desktop';
        
        // Use fixed positioning below Boss HP bar (top right)
        this.buttonConfig = {
            x: 0.944,  // Position to the right of Boss HP bar (680/720)
            y: 0.156,  // Below Boss HP bar (75/480)
            size: 0.07  // Fixed size for all devices
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

    getButtonPx() {
        return {
            x: this.buttonConfig.x * 720,
            y: this.buttonConfig.y * 480,
            size: this.buttonConfig.size * 720
        };
    }

    draw() {
        const img = this.isMuted ? this.soundOffImg : this.soundOnImg;
        const btn = this.getButtonPx();
        this.ctx.drawImage(img, btn.x, btn.y, btn.size, btn.size);
    }

    updatePosition() {
        // No longer needed with percentage-based positioning
        // Positions automatically scale with canvas dimensions
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const canvasX = (event.clientX - rect.left) * scaleX;
        const canvasY = (event.clientY - rect.top) * scaleY;

        const btn = this.getButtonPx();
        const hitSize = btn.size * 1.5; // 50% larger hit area
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

    handleTouch(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const touch = event.touches[0];
        const canvasX = (touch.clientX - rect.left) * scaleX;
        const canvasY = (touch.clientY - rect.top) * scaleY;

        const btn = this.getButtonPx();
        const hitSize = btn.size * 1.5; // 50% larger hit area
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

 toggleMute() {
    this.isMuted = !this.isMuted;
    GLOBAL_MUTE = this.isMuted;

    // Optional: also instantly mute/unmute any currently playing audio
    document.querySelectorAll('audio').forEach(a => a.muted = this.isMuted);
}

    remove() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleTouch);
    }
}
