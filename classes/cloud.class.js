/**
 * Cloud class representing background clouds that move left across the screen.
 * Extends moveableObject to inherit movement functionality.
 * @extends moveableObject
 */


class Cloud extends moveableObject {

     static IMAGES = [ 'IMG/5_background/layers/4_clouds/1.png', 'IMG/5_background/layers/4_clouds/2.png' ]; 
    constructor() {
        super();

        // pick random cloud image
        const img = Cloud.IMAGES[Math.floor(Math.random() * Cloud.IMAGES.length)];
        this.loadImage(img);

        // random starting position
        this.x = 500 + Math.random() * 1500; // spread across the level
        this.y = 20 + Math.random() * 80;    // slight vertical variation

        // cloud size
        this.width = 500;
        this.height = 250;

        // random slow speed
        this.speed = 0.2 + Math.random() * 0.3;

        this.animate();
    }



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
