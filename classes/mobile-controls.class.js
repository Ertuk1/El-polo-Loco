    /**
     * Initializes mobile controls with touch event handlers.
     * MobileControls class providing on-screen touch controls for mobile devices.
     * Displays virtual buttons for movement, jumping, and throwing actions.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Keyboard} keyboard - The keyboard object to update with touch input.
     */
    
        class MobileControls {
            constructor(canvas, keyboard) {
                this.canvas = canvas;
                this.keyboard = keyboard;
                this.useHtmlControls = false;
                
                this.mobileControls = {
                    left:  { x: 0.05, y: 0.80, w: 0.12, h: 0.12 },
                    right: { x: 0.20, y: 0.80, w: 0.12, h: 0.12 },
                    throw: { x: 0.70, y: 0.80, w: 0.12, h: 0.12 },
                    jump:  { x: 0.85, y: 0.80, w: 0.12, h: 0.12 }
                };

                this.initCanvasListeners();
                this.initHtmlListeners();
                this.checkMode();
            }

            
 isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

isTouchDevice() { return ('ontouchstart' in window) || navigator.maxTouchPoints > 0; }

            /**
             * Decides whether to use HTML buttons or Canvas buttons
             */
            checkMode() {
                const tabletElement = document.getElementById('tablet-controls');
                // Logic: 1000px height or higher = HTML buttons
                if (this.isTouchDevice() && window.innerHeight >= 800) {
                    this.useHtmlControls = true;
                    tabletElement.style.display = 'flex';
                } else {
                    this.useHtmlControls = false;
                    tabletElement.style.display = 'none';
                }
            }

            initCanvasListeners() {
                this.handleTouchStartBound = this.handleTouchStart.bind(this);
                this.handleTouchEndBound = this.handleTouchEnd.bind(this);
                this.canvas.addEventListener('touchstart', this.handleTouchStartBound, { passive: false });
                this.canvas.addEventListener('touchend', this.handleTouchEndBound, { passive: false });
                this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
            }

        initHtmlListeners() {
            const bindBtn = (id, keyProperty, extraKey = null) => {
            const el = document.getElementById(id);
            if (!el) return;

            const start = (e) => {
                e.preventDefault();
                this.keyboard[keyProperty] = true;
                if (extraKey) this.keyboard[extraKey] = true;
            };

            const end = (e) => {
                e.preventDefault();
                this.keyboard[keyProperty] = false;
                if (extraKey) this.keyboard[extraKey] = false;
            };

            el.addEventListener('touchstart', start, { passive: false });
            el.addEventListener('touchend', end, { passive: false });
            el.addEventListener('mousedown', start);
            el.addEventListener('mouseup', end);
        };

        bindBtn('btn-left', 'LEFT');
        bindBtn('btn-right', 'RIGHT');
        bindBtn('btn-jump', 'UP', 'SPACE');
        bindBtn('btn-throw', 'D');
    }


            getButtonPx(btn) {
                return {
                    x: btn.x * this.canvas.width,
                    y: btn.y * this.canvas.height,
                    w: btn.w * this.canvas.width,
                    h: btn.h * this.canvas.height
                };
            }

            isInButton(x, y, button) {
                const b = this.getButtonPx(button);
                return (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
            }

            getTouchPos(touch) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                return {
                    x: (touch.clientX - rect.left) * scaleX,
                    y: (touch.clientY - rect.top) * scaleY
                };
            }

            handleTouchStart(e) {
                if (this.useHtmlControls) return; // Ignore canvas touches if using HTML
                e.preventDefault();
                this.updateKeyboardState(e.touches);
            }

            handleTouchEnd(e) {
                if (this.useHtmlControls) return;
                e.preventDefault();
                this.updateKeyboardState(e.touches);
            }

            updateKeyboardState(touches) {
                this.keyboard.LEFT = false;
                this.keyboard.RIGHT = false;
                this.keyboard.UP = false;
                this.keyboard.SPACE = false;
                this.keyboard.D = false;

                for (let touch of touches) {
                    const pos = this.getTouchPos(touch);
                    if (this.isInButton(pos.x, pos.y, this.mobileControls.left)) this.keyboard.LEFT = true;
                    if (this.isInButton(pos.x, pos.y, this.mobileControls.right)) this.keyboard.RIGHT = true;
                    if (this.isInButton(pos.x, pos.y, this.mobileControls.jump)) {
                        this.keyboard.UP = true;
                        this.keyboard.SPACE = true;
                    }
                    if (this.isInButton(pos.x, pos.y, this.mobileControls.throw)) this.keyboard.D = true;
                }
            }

            draw(ctx) {
                // Only draw buttons on canvas if NOT using HTML controls
                if (this.useHtmlControls) return;

                const btns = [
                    { b: this.mobileControls.left, t: '←' },
                    { b: this.mobileControls.right, t: '→' },
                    { b: this.mobileControls.jump, t: '↑' },
                    { b: this.mobileControls.throw, t: 'D' }
                ];

                btns.forEach(item => {
                    const p = this.getButtonPx(item.b);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(p.x, p.y, p.w, p.h);
                    ctx.fillStyle = 'white';
                    ctx.font = '30px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(item.t, p.x + p.w / 2, p.y + p.h / 2);
                });
            }
    /**
     * Removes touch event listeners for cleanup.
     */
    remove() {
    this.canvas.removeEventListener('touchstart', this.handleTouchStartBound, { passive: false });
    this.canvas.removeEventListener('touchend', this.handleTouchEndBound, { passive: false });

    }
}