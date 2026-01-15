/**
 * Coins class representing collectible coin objects in the game world.
 * Extends moveableObject to inherit base functionality.
 * @extends moveableObject
 */
class Coins extends moveableObject {
    /**
     * Initializes a coin at the specified position with fixed dimensions.
     * @param {number} x - The x-coordinate position of the coin.
     * @param {number} y - The y-coordinate position of the coin.
     */
    constructor(x, y) {
        super();
        this.loadImage('IMG/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 80;
    }
}