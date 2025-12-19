class MobileControls {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.mobileControls = {
            left: { x: 20, y: this.canvas.height - 100, w: 80, h: 80 },
            right: { x: 120, y: this.canvas.height - 100, w: 80, h: 80 },
            jump: { x: this.canvas.width - 100, y: this.canvas.height - 100, w: 80, h: 80 },
            throw: { x: this.canvas.width - 200, y: this.canvas.height - 100, w: 80, h: 80 }
        };
        this.handleTouchStartBound = this.handleTouchStart.bind(this);
        this.handleTouchEndBound = this.handleTouchEnd.bind(this);
        this.canvas.addEventListener('touchstart', this.handleTouchStartBound);
        this.canvas.addEventListener('touchend', this.handleTouchEndBound);
    }

    isInButton(x, y, button) {
        return x >= button.x && x <= button.x + button.w && y >= button.y && y <= button.y + button.h;
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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(this.mobileControls.left.x, this.mobileControls.left.y, this.mobileControls.left.w, this.mobileControls.left.h);
        ctx.fillRect(this.mobileControls.right.x, this.mobileControls.right.y, this.mobileControls.right.w, this.mobileControls.right.h);
        ctx.fillRect(this.mobileControls.jump.x, this.mobileControls.jump.y, this.mobileControls.jump.w, this.mobileControls.jump.h);
        ctx.fillRect(this.mobileControls.throw.x, this.mobileControls.throw.y, this.mobileControls.throw.w, this.mobileControls.throw.h);

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('←', this.mobileControls.left.x + this.mobileControls.left.w / 2, this.mobileControls.left.y + this.mobileControls.left.h / 2);
        ctx.fillText('→', this.mobileControls.right.x + this.mobileControls.right.w / 2, this.mobileControls.right.y + this.mobileControls.right.h / 2);
        ctx.fillText('↑', this.mobileControls.jump.x + this.mobileControls.jump.w / 2, this.mobileControls.jump.y + this.mobileControls.jump.h / 2);
        ctx.fillText('D', this.mobileControls.throw.x + this.mobileControls.throw.w / 2, this.mobileControls.throw.y + this.mobileControls.throw.h / 2);
    }

    remove() {
        this.canvas.removeEventListener('touchstart', this.handleTouchStartBound);
        this.canvas.removeEventListener('touchend', this.handleTouchEndBound);
    }
}