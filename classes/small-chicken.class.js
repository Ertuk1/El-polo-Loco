class SmallChicken extends moveableObject {
    height = 50; // Smaller than regular chicken
    y = 380; // Slightly lower to account for smaller size
    width = 60; // Smaller width
    IMAGES_WALKING = [
        'IMG/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'IMG/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'IMG/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ]

    IMAGES_DEAD = ['IMG/3_enemies_chicken/chicken_small/2_dead/dead.png']
    isDead = false;

    constructor(x = null){
        super().loadImage('IMG/3_enemies_chicken/chicken_small/1_walk/2_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.imageDead = this.loadImage('IMG/3_enemies_chicken/chicken_small/2_dead/dead.png');
        this.x = x !== null ? x : 250 + Math.random() * 500;
        this.animate();
        this.isDead = false;
        this.speed = 0.2 + Math.random() * 0.3; // Slightly faster than regular chickens
        this.deathSoundPlayed = false; // Flag to ensure sound plays only once
    }

    die() {
        if (!this.isDead) {  // Only execute if not already dead
            this.isDead = true;  // Set chicken as dead
            this.speed = 0;  // Stop any movement
            
            // Play death sound only once
            if (!this.deathSoundPlayed && !GLOBAL_MUTE) {
                this.deathSoundPlayed = true;
                const deathSound = new Audio('audio/squeaky-toy-1-6059.mp3');
                deathSound.volume = 0.5; // Reduce volume if too loud
                deathSound.play().catch(e => console.log('Audio play failed:', e));
            }
            
            this.loadImage(this.IMAGES_DEAD[0]);
            setTimeout(() => {
                this.removeFromWorld();  // Remove chicken from world after some time
            }, 1000);
        }
    }

    removeFromWorld() {
        // You can either remove the object from the game world entirely or hide it
        this.x = -1000;  // Move it off-screen for simplicity
    }

    animate(){
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() =>{
            this.playAnimation(this.IMAGES_WALKING)
        }, 200)
    }
}