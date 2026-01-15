/**
 * Endboss class representing the final boss enemy with complex attack patterns.
 * Features alert, walking, attacking, hurt, and death animations.
 * @extends moveableObject
 */
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
    isFacingLeft = true;
    target = null;
    isFacingLeft = true;

    /**
     * Initializes the Endboss with all animations and behavior patterns.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ATTACK)
        this.loadImages(this.IMAGES_HURT)
        this.x = 2500;
        this.speed = 10;
        this.BossMove();
        this.playAlertAnimation();
        this.animateWalking();
        this.attackInterval2();
    }

    /**
     * Updates the boss's facing direction based on target (player) position.
     */
    updateFacing() {
        if (!this.target) return;

        if (this.target.x > this.x) {
            this.isFacingLeft = false;
            this.otherDirection = true;
        } else {
            this.isFacingLeft = true;
            this.otherDirection = false;
        }
    }

    /**
     * Triggers attack sequence at regular intervals.
     */
    attackInterval2(){
        setInterval(() => {
            this.triggerAttack();
        }, 4000);
    }

    /**
     * Animates the boss charging toward the player.
     */
    animateCharge() {
        if (GLOBAL_PAUSE) return; 
        let direction = this.target && this.target.x > this.x ? 1 : -1;
        let chargeInterval = setInterval(() => {
            if (this.charge) {
                this.x += this.speed * direction;
            } else {
                clearInterval(chargeInterval);
            }
        }, 50);
    }

    /**
     * Determines the direction to attack based on target position.
     * @returns {number} 1 for right, -1 for left.
     */
    getAttackDirection() {
        return this.target.x > this.x ? 1 : -1;
    }

    /**
     * Applies jump motion physics during attack sequence.
     * @param {number} direction - Direction of movement (1 or -1).
     * @param {number} jumpSpeed - Vertical speed of jump.
     * @param {number} gravity - Downward acceleration.
     * @param {number} jumpHeight - Maximum jump height.
     * @param {boolean} peakReached - Whether jump has reached peak.
     * @param {number} interval - Interval ID to clear when landing.
     */
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

    /**
     * Executes a jumping attack arc toward the player.
     * @param {number} direction - Direction of the jump (1 or -1).
     */
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

    /**
     * Combines jump movement with attack animation.
     */
    jumpAndAttack() {
        if (!this.target) return;

        const direction = this.getAttackDirection();
        this.runJumpArc(direction);
        this.animateAttack();
    }

    /**
     * Checks if the boss is able to perform an attack.
     * @returns {boolean} True if boss can attack.
     */
    canAttack() {
        return !this.isAttacking && !this.isDead1 && this.isWalking && !this.bossHurt;
    }

    /**
     * Initiates the charging phase before an attack.
     */
    startCharge() {
        if (GLOBAL_PAUSE) return; 
        this.charge = true;
        this.speed += 10;
        this.animateCharge();
    }

    /**
     * Starts the attack phase after charging.
     */
    startAttack() {
        if (GLOBAL_PAUSE) return; 
        this.charge = false;
        this.isAttacking = true;
        this.jumpAndAttack();
    }

    /**
     * Ends the attack sequence and returns to normal movement.
     */
    endAttack() {
        this.isAttacking = false;
        this.isWalking = true;
        this.speed -= 10;
    }

    /**
     * Triggers the full attack sequence: charge, attack, and reset.
     */
    triggerAttack() {
        if (GLOBAL_PAUSE) return; 
        if (!this.canAttack()) return;

        this.startCharge();

        setTimeout(() => {
            this.startAttack();

            setTimeout(() => {
                this.endAttack();
            }, 1500);

        }, 1000);
    }

    /**
     * Plays the attack animation during attacking state.
     */
    animateAttack() {
        clearInterval(this.attackInterval);
        this.attackInterval = setInterval(() => {
            if (GLOBAL_PAUSE) return; 
            if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else {
                clearInterval(this.attackInterval);
            }
        }, 200);
    }

    /**
     * Controls the boss movement behavior and facing direction.
     */
    BossMove() {
        setInterval(() => {
            if (GLOBAL_PAUSE) return; 
            if (this.isWalking && !this.isDead1 && !this.isAttacking && !this.bossHurt) {
                this.updateFacing();
                this.animateWalking();
                this.moveLeftBoss();
            }
        }, 200);
    }

    /**
     * Plays the alert animation when boss is not actively walking.
     */
    playAlertAnimation() {
        if (GLOBAL_PAUSE) return; 
        setInterval(() => {
            if (!this.isDead1 && this.isWalking === false) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Plays the walking animation.
     */
    animateWalking() {
        if (GLOBAL_PAUSE) return; 
        this.playAnimation(this.IMAGES_WALK);
    }

    /**
     * Moves the boss left or right based on facing direction.
     */
    moveLeftBoss() {
        if (GLOBAL_PAUSE) return; 
        if (this.isFacingLeft) {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }
    }

    /**
     * Applies damage to the boss and triggers hurt animation.
     * @param {number} damage - Amount of damage to apply.
     */
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
            if (this.hp <= 0) {
                this.die();
            }
        }
    }

    /**
     * Plays the hurt animation for a short duration.
     */
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

    /**
     * Triggers the victory screen after boss death animation.
     */
    triggerVictory() {
        setTimeout(() => {
            world.showVictoryScreen(); 
        }, 1500);
    }

    /**
     * Handles the boss death sequence: sound, animation, and victory trigger.
     */
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

    /**
     * Clears all active intervals for cleanup.
     */
    clearAllIntervals() {
        clearInterval(this.walkingInterval);
        clearInterval(this.attackInterval);
    }

    /**
     * Stops all boss behaviors and animations.
     */
    stop() {
        this.clearAllIntervals();
    }

    /**
     * Plays the death animation sequence.
     */
    animateDeath() {
        if (GLOBAL_PAUSE) return; 
        let deathInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_DEAD);
        }, 200);
    }

    /**
     * Removes the boss from the visible game world.
     */
    removeFromWorld() {
        this.x = -1000;
    }
}