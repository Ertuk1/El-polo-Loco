/**
 * BackgroundObject class representing static background images in the game world.
 * Extends moveableObject to inherit base functionality.
 * @extends moveableObject
 */
class BackgroundObject extends moveableObject {
    width = 720;
    height = 480;
    
    /**
     * Initializes a background object with the specified image and position.
     * @param {string} imagePath - Path to the background image file.
     * @param {number} x - The x-coordinate position.
     * @param {number} y - The y-coordinate position (unused, calculated from height).
     */
    constructor(imagePath , x , y){
        super().loadImage(imagePath)
        this.x = x;
        this.y = 480 - this.height;
    }
}