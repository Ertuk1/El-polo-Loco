class VictoryScreen {
    constructor(canvas, callbacks) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.onReplay = callbacks.replay;
        this.onHome = callbacks.home;

        this.replayButton = {
            x: canvas.width / 2 - 100,
            y: canvas.height / 2 + 40,
            w: 200,
            h: 60
        };

        this.homeButton = {
            x: canvas.width / 2 - 100,
            y: canvas.height / 2 + 120,
            w: 200,
            h: 60
        };

        this.victoryImg = new Image();
        this.victoryImg.src = 'IMG/9_intro_outro_screens/win/won_1.png';

        this.handleClick = this.handleClick.bind(this);
    }

    show() {
        this.victoryImg.onload = () => this.draw();
        this.draw();
        this.canvas.addEventListener("click", this.handleClick);
        this.canvas.addEventListener("touchstart", this.handleClick);
    }

    hide() {
        this.canvas.removeEventListener("click", this.handleClick);
        this.canvas.removeEventListener("touchstart", this.handleClick);
    }

    draw() {
        // Background overlay
        this.ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.drawImage(
            this.victoryImg,
            this.canvas.width / 2 - 200,
            40,
            400,
            220
        );

        // Replay button
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.replayButton.x, this.replayButton.y, this.replayButton.w, this.replayButton.h);

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = 'center';
        this.ctx.font = "66px zabras";
        this.ctx.fillText("Replay", this.canvas.width / 2, this.replayButton.y + 40);

        // Home button
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.homeButton.x, this.homeButton.y, this.homeButton.w, this.homeButton.h);

        this.ctx.fillStyle = "white";
        this.ctx.fillText("Home", this.canvas.width / 2, this.homeButton.y + 40);
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
            canvasX <= this.replayButton.x + this.replayButton.w &&
            canvasY >= this.replayButton.y &&
            canvasY <= this.replayButton.y + this.replayButton.h
        ) {
            this.hide();
            this.onReplay();
        } else if (
            canvasX >= this.homeButton.x &&
            canvasX <= this.homeButton.x + this.homeButton.w &&
            canvasY >= this.homeButton.y &&
            canvasY <= this.homeButton.y + this.homeButton.h
        ) {
            this.hide();
            this.onHome();
        }
    }
}
