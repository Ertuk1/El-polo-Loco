/**
 * Keyboard class tracking the pressed state of game control keys.
 * Used to handle player input for movement and actions.
 */
class Keyboard {
  constructor() {
    this.LEFT = this.RIGHT = this.UP = this.DOWN = this.SPACE = this.D = false;
  }
}

const keyboard = new Keyboard();

/**
 * Maps DOM key values to keyboard properties.
 */
const keyMap = {
  ArrowRight: 'RIGHT', Right: 'RIGHT',
  ArrowLeft: 'LEFT', Left: 'LEFT',
  ArrowUp: 'UP', Up: 'UP',
  ArrowDown: 'DOWN', Down: 'DOWN',
  ' ': 'SPACE',
  d: 'D', D: 'D'
};

/**
 * Updates keyboard state based on event type.
 * @param {KeyboardEvent} e - The key event.
 * @param {boolean} state - True for keydown, false for keyup.
 */
function updateKeyState(e, state) {
  const prop = keyMap[e.key];
  if (prop) {
    e.preventDefault();
    keyboard[prop] = state;
  }
}

window.addEventListener('keydown', e => updateKeyState(e, true));
window.addEventListener('keyup', e => updateKeyState(e, false));
