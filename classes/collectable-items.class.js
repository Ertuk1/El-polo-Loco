class Bottle extends moveableObject {
    Images_Bottles=[
        'IMG/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'IMG/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    constructor(x, y) {
        super().loadImage(this.Images_Bottles[0]);  // Call parent class constructor
        this.loadImages(this.Images_Bottles);  // Path to the bottle image
        this.x = x;  // Set x position
        this.y = y;  // Set y position
        this.width = 100;  // Adjust size
        this.height = 80;
        this.animate();
    }

    animate() {
        // Use playAnimation method from parent class
        setInterval(() => {
            this.playAnimation(this.Images_Bottles); // Pass this.Images_Bottles
        }, 200); // Adjust animation speed
    }

}
