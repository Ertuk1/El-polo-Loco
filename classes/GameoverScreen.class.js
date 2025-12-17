class GameOverScreen {
    constructor(canvas, replayCallback) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.replayCallback = replayCallback;
        this.replayButton = { x: 260, y: 360, width: 200, height: 60 }; // moved slightly lower
        this.gameOverImage = new Image();
        this.gameOverImage.src = 'IMG/9_intro_outro_screens/game_over/you lost.png';
        this.handleClick = this.handleClick.bind(this);
        
    }

    show() {
        this.gameOverImage.onload = () => this.drawGameOver();
        this.drawGameOver();
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('touchstart', this.handleClick);
        this.canvas.addEventListener('mousemove', this.handleHover.bind(this));
    }

    drawGameOver() {
        const { ctx, canvas, replayButton } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.gameOverImage, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '66px zabras';
        ctx.textAlign = 'center';
        ctx.fillText('REPLAY', replayButton.x + replayButton.width / 2, replayButton.y + 38);       
    }

    handleHover(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0].clientY) - rect.top;

        if (
            x >= this.replayButton.x &&
            x <= this.replayButton.x + this.replayButton.width &&
            y >= this.replayButton.y &&
            y <= this.replayButton.y + this.replayButton.height
        ) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0].clientY) - rect.top;

        if (
            x >= this.replayButton.x &&
            x <= this.replayButton.x + this.replayButton.width &&
            y >= this.replayButton.y &&
            y <= this.replayButton.y + this.replayButton.height
        ) {
            this.startReplay();
        }
    }

    startReplay() {
        const newCanvas = recreateCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.replayCallback(newCanvas);
    }
}
