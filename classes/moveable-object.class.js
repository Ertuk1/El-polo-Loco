/**
 * moveableObject class extending DrawableObject with physics and collision detection.
 * Base class for all game objects that can move, take damage, and interact.
 * @extends DrawableObject
 */
class moveableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceeleration = 2;
    energy = 100;
    lastHit = 0;
  
    /**
     * Checks if the object is above ground level.
     * @returns {boolean} True if object is above ground or is a throwable object.
     */
    isAboveGround(){
        if (this instanceof ThrowableObject){
        return    true
        }
        else {
        return this.y < 180;
        }
    }
    
    /**
     * Applies gravity physics to the object, pulling it down over time.
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0){
            this.y -= this.speedY;
            this.speedY -= this.acceeleration;
            }
        }, 1000 / 25);
    }
    
    /**
     * Stops the gravity interval for cleanup.
     */
    stop() {
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
        }
    }
    
    /**
     * Checks if this object is colliding with another moveable object.
     * @param {moveableObject} mo - The other object to check collision with.
     * @returns {boolean} True if objects are colliding.
     */
    isColliding(mo){
    return this.x + this.width > mo.x &&
        this.y + this.height > mo.y &&
        this.x < mo.x &&
        this.y < mo.y + mo.height;
    }
    
    /**
     * Moves the object to the right by its speed value.
     */
    moveRight() {
        this.x += this.speed;
    }
    
    /**
     * Moves the object to the left by its speed value.
     */
    moveLeft() {
        this.x -= this.speed;
    }
    
    /**
     * Plays an animation by cycling through an array of image paths.
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageChache[path];
        this.currentImage++;
    }
    
    /**
     * Applies damage to the object with a cooldown to prevent rapid consecutive hits.
     * @param {Object} enemy - The enemy object causing the damage.
     */
    hit(enemy) {
        const now = new Date().getTime();
        const timeSinceLastHit = now - (this.lastHit || 0);
    
        if (timeSinceLastHit < 1000) {
            return;
        }
    
        if (!enemy.isDead) {
            this.energy -= 10;
            if (this.energy < 0) {
                this.energy = 0;
            }
            this.lastHit = now;
        }
    }
    
    /**
     * Checks if the object is currently in a hurt state.
     * @returns {boolean} True if less than 1 second has passed since last hit.
     */
    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }
    
    /**
     * Checks if the object is dead (energy depleted).
     * @returns {boolean} True if energy is zero.
     */
    isDead(){
        return this.energy == 0;
    }
}