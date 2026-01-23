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
 * Creates event listeners for a control button and binds them to keyboard states.
 * @param {string} id - The HTML element ID of the button.
 * @param {string[]} keys - Keyboard keys to toggle when the button is pressed.
 */
bindControlButton(id, keys) {
  const el = document.getElementById(id);
  if (!el) return;

  /**
   * Sets the keyboard state for the given keys.
   * @param {boolean} state - True when pressed, false when released.
   */
  const setState = (state) => (e) => {
    e.preventDefault();
    keys.forEach(k => this.keyboard[k] = state);
  };

  el.addEventListener('touchstart', setState(true), { passive: false });
  el.addEventListener('touchend', setState(false), { passive: false });
  el.addEventListener('mousedown', setState(true));
  el.addEventListener('mouseup', setState(false));
}

/**
 * Initializes HTML listeners for all mobile control buttons.
 */
initHtmlListeners() {
  const controls = [
    { id: 'btn-left', keys: ['LEFT'] },
    { id: 'btn-right', keys: ['RIGHT'] },
    { id: 'btn-jump', keys: ['UP','SPACE'] },
    { id: 'btn-throw', keys: ['D'] }
  ];

  controls.forEach(({id, keys}) => this.bindControlButton(id, keys));
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
        KeyboardControlls()
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
     * sets all keyboard booleans to false 
     */
    KeyboardControlls(){
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.UP = false;
        this.keyboard.SPACE = false;
        this.keyboard.D = false;
    }

    /**
     * Removes touch event listeners for cleanup.
     */
    remove() {
        this.canvas.removeEventListener('touchstart', this.handleTouchStartBound, { passive: false });
        this.canvas.removeEventListener('touchend', this.handleTouchEndBound, { passive: false });

    }
}