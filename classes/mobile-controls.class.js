class MobileControls {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.mobileControls = {
            left:  { x: 0.05, y: 0.80, w: 0.12, h: 0.12 },
            right: { x: 0.20, y: 0.80, w: 0.12, h: 0.12 },
            throw: { x: 0.70, y: 0.80, w: 0.12, h: 0.12 },
            jump:  { x: 0.85, y: 0.80, w: 0.12, h: 0.12 }
        };
        this.handleTouchStartBound = this.handleTouchStart.bind(this);
        this.handleTouchEndBound = this.handleTouchEnd.bind(this);
        this.canvas.addEventListener('touchstart', this.handleTouchStartBound);
        this.canvas.addEventListener('touchend', this.handleTouchEndBound);
    }

    getButtonPx(btn) {
    return {
        x: btn.x * this.canvas.width,
        y: btn.y * this.canvas.height,
        w: btn.w * this.canvas.width,
        h: btn.h * this.canvas.width   // square buttons
    };
}


isInButton(x, y, button) {
    const b = this.getButtonPx(button);
    return (
        x >= b.x &&
        x <= b.x + b.w &&
        y >= b.y &&
        y <= b.y + b.h
    );
}



    handleTouchStart(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const canvasX = (touch.clientX - rect.left) * scaleX;
            const canvasY = (touch.clientY - rect.top) * scaleY;
            if (this.isInButton(canvasX, canvasY, this.mobileControls.left)) {
                this.keyboard.LEFT = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.right)) {
                this.keyboard.RIGHT = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.jump)) {
                this.keyboard.UP = true;
                this.keyboard.SPACE = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.throw)) {
                this.keyboard.D = true;
            }
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();
        // Reset all keys
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.UP = false;
        this.keyboard.SPACE = false;
        this.keyboard.D = false;
        // Then set based on remaining touches
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const canvasX = (touch.clientX - rect.left) * scaleX;
            const canvasY = (touch.clientY - rect.top) * scaleY;
            if (this.isInButton(canvasX, canvasY, this.mobileControls.left)) {
                this.keyboard.LEFT = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.right)) {
                this.keyboard.RIGHT = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.jump)) {
                this.keyboard.UP = true;
                this.keyboard.SPACE = true;
            } else if (this.isInButton(canvasX, canvasY, this.mobileControls.throw)) {
                this.keyboard.D = true;
            }
        }
    }

draw(ctx) {
    const l = this.getButtonPx(this.mobileControls.left);
    const r = this.getButtonPx(this.mobileControls.right);
    const j = this.getButtonPx(this.mobileControls.jump);
    const t = this.getButtonPx(this.mobileControls.throw);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(l.x, l.y, l.w, l.h);
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.fillRect(j.x, j.y, j.w, j.h);
    ctx.fillRect(t.x, t.y, t.w, t.h);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('←', l.x + l.w / 2, l.y + l.h / 2);
    ctx.fillText('→', r.x + r.w / 2, r.y + r.h / 2);
    ctx.fillText('↑', j.x + j.w / 2, j.y + j.h / 2);
    ctx.fillText('D', t.x + t.w / 2, t.y + t.h / 2);
}


    remove() {
        this.canvas.removeEventListener('touchstart', this.handleTouchStartBound);
        this.canvas.removeEventListener('touchend', this.handleTouchEndBound);
    }
}