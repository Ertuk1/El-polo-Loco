class FullscreenButton {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isMobile = window.innerWidth <= 720;
        this.isSmallMobile = window.innerWidth < 410;
        this.size = this.isMobile ? (this.isSmallMobile ? 100 : 80) : 50;
        this.x = canvas.width - (this.isMobile ? (this.isSmallMobile ? 120 : 120) : 140);
        this.y = this.isMobile ? (this.isSmallMobile ? 100 : 60) : 20;

        this.fullscreenImg = new Image();
        this.fullscreenImg.src = 'IMG/full-screen.png';
        this.minimizeImg = new Image();
        this.minimizeImg.src = 'IMG/minimize.png';

        this.handleClick = this.handleClick.bind(this);
        this.handleTouch = this.handleTouch.bind(this);
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('touchstart', this.handleTouch, { passive: false });
        
        this.handleClick = this.handleClick.bind(this);
        this.handleTouch = this.handleTouch.bind(this);

        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('touchstart', this.handleTouch, { passive: false });


    }

    draw() {
        const isFullscreen = !!document.fullscreenElement;
        const img = isFullscreen ? this.minimizeImg : this.fullscreenImg;
        this.ctx.drawImage(img, this.x, this.y, this.size, this.size);
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const canvasX = (event.clientX - rect.left) * scaleX;
        const canvasY = (event.clientY - rect.top) * scaleY;

        const hitSize = this.size * 1.5; // 50% larger hit area
        const offset = (hitSize - this.size) / 2;

        if (
            canvasX >= this.x - offset &&
            canvasX <= this.x + this.size + offset &&
            canvasY >= this.y - offset &&
            canvasY <= this.y + this.size + offset
        ) {
            this.toggleFullscreen();
        }
    }

    handleTouch(event) {
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const touch = event.touches[0];
        const canvasX = (touch.clientX - rect.left) * scaleX;
        const canvasY = (touch.clientY - rect.top) * scaleY;

        const hitSize = this.size * 1.5; // 50% larger hit area
        const offset = (hitSize - this.size) / 2;

        if (
            canvasX >= this.x - offset &&
            canvasX <= this.x + this.size + offset &&
            canvasY >= this.y - offset &&
            canvasY <= this.y + this.size + offset
        ) {
            this.toggleFullscreen();
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.canvas.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    remove() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleTouch);
    }
}