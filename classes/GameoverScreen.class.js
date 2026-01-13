class GameOverScreen {
    constructor(canvas, callbacks) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.onReplay = callbacks.replay;
        this.onHome = callbacks.home;
        this.replayButton = { x: 260, y: 360, width: 200, height: 60 }; // moved slightly lower
        this.homeButton = { x: 260, y: 440, width: 200, height: 60 };
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
        const { ctx, canvas, replayButton, homeButton } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.gameOverImage, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '66px zabras';
        ctx.textAlign = 'center';
        ctx.fillText('REPLAY', replayButton.x + replayButton.width / 2, replayButton.y + 38);
        ctx.fillText('HOME', homeButton.x + homeButton.width / 2, homeButton.y + 38);
    }

    handleHover(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0].clientY) - rect.top;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;

        if (
            (canvasX >= this.replayButton.x &&
            canvasX <= this.replayButton.x + this.replayButton.width &&
            canvasY >= this.replayButton.y &&
            canvasY <= this.replayButton.y + this.replayButton.height) ||
            (canvasX >= this.homeButton.x &&
            canvasX <= this.homeButton.x + this.homeButton.width &&
            canvasY >= this.homeButton.y &&
            canvasY <= this.homeButton.y + this.homeButton.height)
        ) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    handleClick(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX || event.touches?.[0].clientX) - rect.left;
        const y = (event.clientY || event.touches?.[0].clientY) - rect.top;
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;

        if (
            canvasX >= this.replayButton.x &&
            canvasX <= this.replayButton.x + this.replayButton.width &&
            canvasY >= this.replayButton.y &&
            canvasY <= this.replayButton.y + this.replayButton.height
        ) {
            this.startReplay();
        } else if (
            canvasX >= this.homeButton.x &&
            canvasX <= this.homeButton.x + this.homeButton.width &&
            canvasY >= this.homeButton.y &&
            canvasY <= this.homeButton.y + this.homeButton.height
        ) {
            this.goHome();
        }
    }

    startReplay() {
        const newCanvas = recreateCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.onReplay(newCanvas);
    }

    goHome() {
        const newCanvas = recreateCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.onHome(newCanvas);
    }
}
