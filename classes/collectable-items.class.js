/**
 * Bottle class representing collectible bottle objects that animate on the ground.
 * Extends moveableObject to inherit base functionality.
 * @extends moveableObject
 */
class Bottle extends moveableObject {
    Images_Bottles=[
        'IMG/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'IMG/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]
    
    /**
     * Initializes a bottle at the specified position with animation.
     * @param {number} x - The x-coordinate position of the bottle.
     * @param {number} y - The y-coordinate position of the bottle.
     */
    constructor(x, y) {
        super().loadImage(this.Images_Bottles[0]);
        this.loadImages(this.Images_Bottles);
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 80;
        this.animate();
    }
    
    /**
     * Starts the animation loop to cycle through bottle images.
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.Images_Bottles);
        }, 200);
    }
    
    /**
     * Stops the animation interval for cleanup.
     */
    stop() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
}