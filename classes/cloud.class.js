/**
 * Cloud class representing background clouds that move left across the screen.
 * Extends moveableObject to inherit movement functionality.
 * @extends moveableObject
 */


class Cloud extends moveableObject {

     static IMAGES = [ 'IMG/5_background/layers/4_clouds/1.png', 'IMG/5_background/layers/4_clouds/2.png' ]; 
    constructor() {
        super();
        const img = Cloud.IMAGES[Math.floor(Math.random() * Cloud.IMAGES.length)];
        this.loadImage(img);
        this.x = 500 + Math.random() * 1500;
        this.y = 20 + Math.random() * 80;    
        this.width = 500;
        this.height = 250;
        this.speed = 0.2 + Math.random() * 0.3;
        this.animate();
    }


    /**
 * Continuously updates the cloud's position to create a scrolling animation.
 * Moves the cloud left each frame and respawns it on the right side once it exits the screen.
 * Runs at approximately 60 frames per second.
 */

    animate() {
        setInterval(() => {
            this.x -= this.speed;

            // respawn cloud when it leaves the screen
            if (this.x < -this.width) {
                this.x = 2200 + Math.random() * 500;
                this.y = 20 + Math.random() * 80;
            }
        }, 1000 / 60);
    }
}
