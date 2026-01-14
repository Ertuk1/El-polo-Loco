class PauseScreen  {
    constructor(canvas, actions) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.actions = actions;

        this.resumeButton = { x: 260, y: 200, w: 200, h: 60 };
        this.homeButton = { x: 260, y: 280, w: 200, h: 60 };

        this.handleClick = this.handleClick.bind(this);
    }

    show() {
        this.draw();
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('touchstart', this.handleClick);
    }

    hide() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('touchstart', this.handleClick);
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawButton(this.resumeButton, 'Resume');
        this.drawButton(this.homeButton, 'Home');
    }

    drawButton(btn, text) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '36px zabras';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, btn.x + btn.w / 2, btn.y + 42);
    }

    handleClick(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

        const hit = (b) =>
            x >= b.x && x <= b.x + b.w &&
            y >= b.y && y <= b.y + b.h;

        if (hit(this.resumeButton)) this.actions.resume();
        if (hit(this.homeButton)) this.actions.home();
    }
}
