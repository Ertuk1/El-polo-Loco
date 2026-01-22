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


        this.initHtmlListeners(keyboard);

       
    }


    /**
 * Initializes touch and mouse event listeners for HTML-based mobile control buttons.
 * Maps button presses to keyboard input states.
 */

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



    /**
 * Converts a touch event position into scaled canvas coordinates.
 * @param {Touch} touch - The touch object from a touch event.
 * @returns {{x: number, y: number}} Scaled canvas coordinates.
 */

    getTouchPos(touch) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    }


    /**
 * Updates the virtual keyboard state based on all active touches.
 * Maps touch positions to movement, jump, and throw actions.
 * @param {TouchList} touches - The list of active touches.
 */

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
    /**
     * Removes touch event listeners for cleanup.
     */
    remove() {
        this.canvas.removeEventListener('touchstart', this.handleTouchStartBound, { passive: false });
        this.canvas.removeEventListener('touchend', this.handleTouchEndBound, { passive: false });

    }
}