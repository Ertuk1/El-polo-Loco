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
    isFacingLeft = true;   // Boss initially looks left
    target = null;        // Will be the Character
    isFacingLeft = true;   // Boss initially looks left



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

    updateFacing() {
    if (!this.target) return;

    if (this.target.x > this.x) {
        this.isFacingLeft = false;   // Player is to the right
        this.otherDirection = true; // engine flip
    } else {
        this.isFacingLeft = true;    // Player is to the left
        this.otherDirection = false;
    }
}


    attackInterval2(){
        setInterval(() => {
            this.triggerAttack();
        }, 4000);
    }

    animateCharge() {
        // Determine direction: -1 for left, 1 for right
        let direction = this.target && this.target.x > this.x ? 1 : -1;
        let chargeInterval = setInterval(() => {
            if (this.charge) {
                this.x += this.speed * direction; // Move Endboss toward the player during charge
            } else {
                clearInterval(chargeInterval);
            }
        }, 50); // Smooth movement during charging
    }
    
 
getAttackDirection() {
    return this.target.x > this.x ? 1 : -1;
}

applyJumpMotion(direction, jumpSpeed, gravity, jumpHeight, peakReached, interval) {
    if (!peakReached) {
        this.y -= jumpSpeed;
    } else {
        this.y += gravity;
    }

    this.x += 5 * direction;

    if (this.y >= 60) {
        this.y = 60;
        clearInterval(interval);
    }
}

runJumpArc(direction) {
    const jumpHeight = 150;
    const jumpSpeed = 10;
    const gravity = 5;

    let peakReached = false;

    const jumpInterval = setInterval(() => {
        this.applyJumpMotion(direction, jumpSpeed, gravity, jumpHeight, peakReached, jumpInterval);
        if (this.y <= 60 - jumpHeight) peakReached = true;
    }, 50);
}

jumpAndAttack() {
    if (!this.target) return;

    const direction = this.getAttackDirection();
    this.runJumpArc(direction);
    this.animateAttack();
}

canAttack() {
    return !this.isAttacking && !this.isDead1 && this.isWalking && !this.bossHurt;
}

startCharge() {
    this.charge = true;
    this.speed += 10;
    this.animateCharge();
}

startAttack() {
    this.charge = false;
    this.isAttacking = true;
    this.jumpAndAttack();
}

endAttack() {
    this.isAttacking = false;
    this.isWalking = true;
    this.speed -= 10;
}

triggerAttack() {
    if (!this.canAttack()) return;

    console.log('Charge initiated');
    this.startCharge();

    setTimeout(() => {
        console.log('Charging completed, starting attack');
        this.startAttack();

        setTimeout(() => {
            console.log('Attack completed');
            this.endAttack();
        }, 1500);

    }, 1000);
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
            this.updateFacing();
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
            if (this.isFacingLeft) {
        this.x -= this.speed;
    } else {
        this.x += this.speed;
    }
    }
 

    hit(damage) {
        if (!this.isDead1) {
            this.bossHurt=true;
            this.hp -= damage;
            if (!GLOBAL_MUTE) {
                const hurtSound = new Audio('audio/fussing-rooster-in-indian-village-natural-ambience-330927.mp3');
                hurtSound.play();
                setTimeout(() => {
                    hurtSound.pause();
                    hurtSound.currentTime = 0;
                }, 1000);
            }
            this.hurtanimation()
            console.log(`Bottle hit the Endboss! HP: ${this.hp}`);
            if (this.hp <= 0) {
                this.die();  // Trigger death if HP drops to 0 or below
            }

          
        }
    }

    hurtanimation() {
        if (this.bossHurt) {
            if (this.hurtAnimationInterval) {
                clearInterval(this.hurtAnimationInterval);
            }
            this.hurtAnimationInterval = setInterval(() => {
                this.playAnimation(this.IMAGES_HURT);
            }, 200);
            setTimeout(() => {
                clearInterval(this.hurtAnimationInterval); 
                this.hurtAnimationInterval = null; 
                this.bossHurt = false; 
            }, 1000); 
        }
    }

    triggerVictory() {
    setTimeout(() => {
        world.showVictoryScreen(); 
    }, 1500); // time for death animation
}
    

    die() {
        if (!this.isDead1 && !this.victoryTriggered) {
            this.isDead1 = true;
             this.victoryTriggered = true;
  
            if (!GLOBAL_MUTE) {
                const deathSound = new Audio('audio/clucking-chicken-440624.mp3');
                deathSound.play();
            }
            this.triggerVictory();
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

    stop() {
        this.clearAllIntervals();
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
