class moveableObject extends DrawableObject {


    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceeleration = 2;
    energy = 100;
    lastHit = 0;
  

    isAboveGround(){
        if (this instanceof ThrowableObject){
        return    true
        }
        else {
        return this.y < 180;
        }
    }

    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0){
            this.y -= this.speedY;
            this.speedY -= this.acceeleration;
            }
        }, 1000 / 25);
    
    }

    stop() {
        if (this.gravityInterval) {
            clearInterval(this.gravityInterval);
        }
    }

    isColliding(mo){
    return this.x + this.width > mo.x &&
        this.y + this.height > mo.y &&
        this.x < mo.x &&
        this.y < mo.y + mo.height;
    }


    moveRight() {
        this.x += this.speed;
        
    }

    moveLeft() {
            this.x -= this.speed;
    }

    playAnimation(images) {
       

        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageChache[path];
        this.currentImage++;
    }

    hit(enemy) {
        const now = new Date().getTime();
        const timeSinceLastHit = now - (this.lastHit || 0);
    
        if (timeSinceLastHit < 1000) {
            return; // Less than 1 second since last hit: ignore this hit
        }
    
        // Only reduce energy if the enemy is not dead
        if (!enemy.isDead) {
            this.energy -= 10;
            if (this.energy < 0) {
                this.energy = 0;
            }
            this.lastHit = now; // Update last hit time
        }
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;

    }

    isDead(){
        return this.energy == 0;
    }
}