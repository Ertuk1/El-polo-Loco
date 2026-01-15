/**
 * SmallChicken class representing a smaller, faster variant of the chicken enemy.
 * Extends moveableObject to inherit movement and collision functionality.
 * @extends moveableObject
 */
class SmallChicken extends moveableObject {
    height = 50;
    y = 380;
    width = 60;
    IMAGES_WALKING = [
        'IMG/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'IMG/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'IMG/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ]
    IMAGES_DEAD = ['IMG/3_enemies_chicken/chicken_small/2_dead/dead.png']
    isDead = false;
    
    /**
     * Initializes a small chicken enemy at a random or specified position.
     * @param {number|null} x - The x-coordinate for the small chicken, or null for random placement.
     */
    constructor(x = null){
        super().loadImage('IMG/3_enemies_chicken/chicken_small/1_walk/2_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.imageDead = this.loadImage('IMG/3_enemies_chicken/chicken_small/2_dead/dead.png');
        this.x = x !== null ? x : 250 + Math.random() * 500;
        this.animate();
        this.isDead = false;
        this.speed = 0.2 + Math.random() * 0.3;
        this.deathSoundPlayed = false;
    }
    
    /**
     * Marks the small chicken as dead, plays death sound, and schedules removal.
     */
    die() {
        if (!this.isDead) {
            this.isDead = true;
            this.speed = 0;
            
            if (!this.deathSoundPlayed && !GLOBAL_MUTE) {
                this.deathSoundPlayed = true;
                const deathSound = new Audio('audio/squeaky-toy-1-6059.mp3');
                deathSound.volume = 0.5;
                deathSound.play().catch(e => {});
            }
            
            this.loadImage(this.IMAGES_DEAD[0]);
            setTimeout(() => {
                this.removeFromWorld();
            }, 1000);
        }
    }
    
    /**
     * Removes the small chicken from the visible game world by moving it off-screen.
     */
    removeFromWorld() {
        this.x = -1000;
    }
    
    /**
     * Starts the animation loops for movement and sprite animation.
     * Respects GLOBAL_PAUSE state to prevent updates when paused.
     */
    animate(){
        this.movementInterval = setInterval(() => {
            if (GLOBAL_PAUSE) return; 
            this.moveLeft();
        }, 1000 / 60);
        this.animationInterval = setInterval(() =>{
             if (GLOBAL_PAUSE) return; 
            this.playAnimation(this.IMAGES_WALKING)
        }, 200)
    }
    
    /**
     * Stops all animation intervals for cleanup.
     */
    stop() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
        }
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
}