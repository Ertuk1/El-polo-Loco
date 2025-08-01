class Endboss extends moveableObject {
    IMAGES_WALKING = [
        'IMG/4_enemie_boss_chicken/2_alert/G5.png',
        'IMG/4_enemie_boss_chicken/2_alert/G6.png',
        'IMG/4_enemie_boss_chicken/2_alert/G7.png',
        'IMG/4_enemie_boss_chicken/2_alert/G8.png',
        'IMG/4_enemie_boss_chicken/2_alert/G9.png',
        'IMG/4_enemie_boss_chicken/2_alert/G10.png',
        'IMG/4_enemie_boss_chicken/2_alert/G11.png',
        'IMG/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_DEAD = [
        'IMG/4_enemie_boss_chicken/5_dead/G24.png',
        'IMG/4_enemie_boss_chicken/5_dead/G25.png',
        'IMG/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    IMAGES_WALK = [
        'IMG/4_enemie_boss_chicken/1_walk/G1.png',
        'IMG/4_enemie_boss_chicken/1_walk/G2.png',
        'IMG/4_enemie_boss_chicken/1_walk/G3.png',
        'IMG/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ATTACK = [
        'IMG/4_enemie_boss_chicken/3_attack/G13.png',
        'IMG/4_enemie_boss_chicken/3_attack/G14.png',
        'IMG/4_enemie_boss_chicken/3_attack/G15.png',
        'IMG/4_enemie_boss_chicken/3_attack/G16.png',
        'IMG/4_enemie_boss_chicken/3_attack/G17.png',
        'IMG/4_enemie_boss_chicken/3_attack/G18.png',
        'IMG/4_enemie_boss_chicken/3_attack/G19.png',
        'IMG/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [

        'IMG/4_enemie_boss_chicken/4_hurt/G21.png',
        'IMG/4_enemie_boss_chicken/4_hurt/G22.png',
        'IMG/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    hp = 100;
    height = 400;
    width = 250;
    y = 60;
    isDead1 = false;
    walkingInterval;
    attackInterval;
    deathTimeout;
    isAttacking = false;
    distanceCheckInterval;
    walkingInterval;
    attackInterval;
    isWalking = false;
    charge = false;
    bossHurt = false; 

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ATTACK)
        this.loadImages(this.IMAGES_HURT)
        this.x = 2500;
        this.speed = 10;  // Endboss speed when walking starts
        this.BossMove();
        this.playAlertAnimation();  // Start with alert animation
        this.animateWalking();
        this.attackInterval2();
        
    }

    attackInterval2(){
        setInterval(() => {
            this.triggerAttack();
        }, 4000);
    }

    animateCharge() {
        let chargeInterval = setInterval(() => {
            if (this.charge) {
                this.x -= this.speed; // Move Endboss during charge
            } else {
                clearInterval(chargeInterval);
            }
        }, 50); // Smooth movement during charging
    }
    
 
    triggerAttack() {
        if (!this.isAttacking && !this.isDead1 && this.isWalking && !this.bossHurt ) {
            console.log('Charge initiated');
            this.charge = true; // Start charging
            this.speed += 10;
    
            this.animateCharge();
    
            setTimeout(() => {
                console.log('Charging completed, starting attack');
                this.charge = false; // End charging
                this.isAttacking = true; // Start attacking
    
                this.jumpAndAttack(); // Perform jump and attack
    
                setTimeout(() => {
                    console.log('Attack completed');
                    this.isAttacking = false;
                    this.isWalking = true; // Resume walking after attack
                    this.speed -= 10; // Reset speed
                }, 1500); // Attack duration (1.5 seconds)
            }, 1000); // Charging duration (1 second)
        }
    }

    jumpAndAttack() {
        let jumpHeight = 150; // Maximum height of the jump
        let jumpSpeed = 10; // Speed of upward movement
        let gravity = 5; // Simulated gravity
        let peakReached = false;
    
        let jumpInterval = setInterval(() => {
            if (!peakReached) {
                // Move upward until peak is reached
                this.y -= jumpSpeed;
                this.x -= 5; // Move forward slightly during the jump
                if (this.y <= 60 - jumpHeight) { // Peak of the jump
                    peakReached = true;
                }
            } else {
                // Move downward (simulate gravity)
                this.y += gravity;
                this.x -= 5; // Continue moving forward while falling
                if (this.y >= 60) { // Return to ground level
                    this.y = 60; // Ensure Endboss lands at the correct position
                    clearInterval(jumpInterval);
                }
            }
        }, 50); // Smooth jumping animation
    
        this.animateAttack(); // Play attack animation during the jump
    }

    animateAttack() {
        clearInterval(this.attackInterval); // Clear any previous attack animations
        this.attackInterval = setInterval(() => {
            if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK); // Play attack frames
            } else {
                clearInterval(this.attackInterval);
            }
        }, 200); // Smooth attack animation
    }


BossMove() {
    setInterval(() => {
        if (this.isWalking && !this.isDead1 && !this.isAttacking && !this.bossHurt) {
            this.animateWalking();
            this.moveLeftBoss();
            
        }
    }, 200);
}

    playAlertAnimation() {
        // Play alert animation while Endboss is idle
        setInterval(() => {

            if (!this.isDead1 && this.isWalking === false) {
                this.playAnimation(this.IMAGES_WALKING);
            }

        }, 200);
    }





    animateWalking() {
        this.playAnimation(this.IMAGES_WALK);
    }



 
    moveLeftBoss() {
        this.x -= this.speed;
    }
 

    hit(damage) {
        if (!this.isDead1) {
            this.bossHurt=true;
            this.hp -= damage;
            
            this.hurtanimation()
            console.log(`Bottle hit the Endboss! HP: ${this.hp}`);

            if (this.hp <= 0) {
                this.die();  // Trigger death if HP drops to 0 or below
            }

          
        }
    }

    hurtanimation() {
        if (this.bossHurt) {
            // Clear any previous hurt animation to prevent multiple intervals
            if (this.hurtAnimationInterval) {
                clearInterval(this.hurtAnimationInterval);
            }
    
            // Start the hurt animation
            this.hurtAnimationInterval = setInterval(() => {
                this.playAnimation(this.IMAGES_HURT);
            }, 200);
    
            // Stop the hurt animation after 1 second
            setTimeout(() => {
                clearInterval(this.hurtAnimationInterval); // Clear the interval
                this.hurtAnimationInterval = null; // Reset the property
                this.bossHurt = false; // Allow other animations to resume
            }, 1000); // Duration of the hurt animation
        }
    }
    

    die() {
        if (!this.isDead1) {
            this.isDead1 = true;
            this.clearAllIntervals();
            this.animateDeath();
            setTimeout(() => {
                this.removeFromWorld();
            }, 1000);
        }
    }

    clearAllIntervals() {
        clearInterval(this.walkingInterval);
        clearInterval(this.attackInterval);  // Clear attack interval as well
    }

    animateDeath() {
        let deathInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_DEAD);
        }, 200);
    }

    removeFromWorld() {
        this.x = -1000;  // Move off-screen or remove from game world
    }
}
