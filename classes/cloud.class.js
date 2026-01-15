/**
 * Cloud class representing background clouds that move left across the screen.
 * Extends moveableObject to inherit movement functionality.
 * @extends moveableObject
 */
class Cloud extends moveableObject {
    y = 20;
    height = 250;
    width = 500;
    
    /**
     * Initializes a cloud at a random x-position and starts its movement.
     */
    constructor(){
        super().loadImage('IMG/5_background/layers/4_clouds/1.png')
        this.x = Math.random() * 500;
        this.animate();
    }
    
    /**
     * Starts the cloud moving left continuously.
     */
    animate(){
        this.moveLeft();
    }
}