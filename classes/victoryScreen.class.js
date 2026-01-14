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

    getCanvasCoords(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const clientX = event.clientX || event.touches?.[0].clientX;
    const clientY = event.clientY || event.touches?.[0].clientY;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

isInside(x, y, btn) {
    return (
        x >= btn.x &&
        x <= btn.x + btn.w &&
        y >= btn.y &&
        y <= btn.y + btn.h
    );
}

handleClick(event) {
    event.preventDefault();
    const { x, y } = this.getCanvasCoords(event);

    if (this.isInside(x, y, this.replayButton)) {
        this.hide();
        this.onReplay();
    } 
    else if (this.isInside(x, y, this.homeButton)) {
        this.hide();
        this.onHome();
    }
}

drawOverlay() {
    this.ctx.fillStyle = "rgba(0,0,0,0.8)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

drawVictoryImage() {
    this.ctx.drawImage(
        this.victoryImg,
        this.canvas.width / 2 - 200,
        40,
        400,
        220
    );
}

drawButton(btn, text) {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.font = "66px zabras";
    this.ctx.fillText(text, this.canvas.width / 2, btn.y + 40);
}

draw() {
    this.drawOverlay();
    this.drawVictoryImage();
    this.drawButton(this.replayButton, "Replay");
    this.drawButton(this.homeButton, "Home");
}

}
