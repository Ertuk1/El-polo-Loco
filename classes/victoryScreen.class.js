class VictoryScreen {
    constructor(canvas, onReplay) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.onReplay = onReplay;

        this.button = {
            x: canvas.width / 2 - 100,
            y: canvas.height / 2 + 40,
            w: 200,
            h: 60
        };

        this.victoryImg = new Image();
        this.victoryImg.src = 'IMG/9_intro_outro_screens/win/won_1.png';

        this.handleClick = this.handleClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    show() {
        this.victoryImg.onload = () => this.draw();
        this.draw();
        this.canvas.addEventListener("click", this.handleClick);
    }

    hide() {
        this.canvas.removeEventListener("click", this.handleClick);
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
        
        this.ctx.fillRect(this.button.x, this.button.y, this.button.w, this.button.h);

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = 'center';
        this.ctx.font = "66px zabras";
        this.ctx.fillText("Replay", this.canvas.width / 2, this.button.y + 40);
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (
            x >= this.button.x &&
            x <= this.button.x + this.button.w &&
            y >= this.button.y &&
            y <= this.button.y + this.button.h
        ) {
            this.hide();
            this.onReplay();
            recreateCanvas();
        }
    }
}
