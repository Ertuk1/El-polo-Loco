class MuteButton {
    constructor(canvas, sounds) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.sounds = sounds; // optional: pass in game sounds later
        this.x = canvas.width - 70; // position (top-right corner)
        this.y = 20;
        this.size = 50;
        this.isMuted = false;

        this.soundOnImg = new Image();
        this.soundOnImg.src = 'IMG/muteButtons/icons8-ton-67.png';
        this.soundOffImg = new Image();
        this.soundOffImg.src = 'IMG/muteButtons/icons8-ton-stummschalten-67.png';

        this.handleClick = this.handleClick.bind(this);
        this.canvas.addEventListener('click', this.handleClick);
    }

    draw() {
        const img = this.isMuted ? this.soundOffImg : this.soundOnImg;
        this.ctx.drawImage(img, this.x, this.y, this.size, this.size);
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        if (
            clickX >= this.x &&
            clickX <= this.x + this.size &&
            clickY >= this.y &&
            clickY <= this.y + this.size
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
    }
}
