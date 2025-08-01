class Coins extends moveableObject {
    constructor(x, y) {
        super();  // Call parent class constructor
        this.loadImage('IMG/8_coin/coin_1.png');  // Path to the bottle image
        this.x = x;  // Set x position
        this.y = y;  // Set y position
        this.width = 100;  // Adjust size
        this.height = 80;
    }
}
