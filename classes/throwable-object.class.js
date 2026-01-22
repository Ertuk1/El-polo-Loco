class ThrowableObject extends moveableObject {
    IMAGES_ROTATION = [
        'IMG/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'IMG/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'IMG/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'IMG/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    IMAGES_BREAK = [
        'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'IMG/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];
    currentImageIndex = 0;
    isBroken = false;
    rotationIntervalId = null;
    breakSound = new Audio('audio/bottlecrack.mp3');
    throwSound = new Audio('audio/throw.mp3');

    constructor(x, y, direction) {
        super();
        this.x = x;
        this.y = y - 100;
        this.height = 60;
        this.width = 50;
        this.direction = direction;
        this.hasFlown = false;
        this.spawnProtection = true; setTimeout(() => { this.spawnProtection = false; }, 150);
        this.loadImage('IMG/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_BREAK);
        this.throw();
    }

    stopRotation() {
        if (this.rotationIntervalId) {
            clearInterval(this.rotationIntervalId);
            this.rotationIntervalId = null;
        }
    }

    triggerBreakingAnimation() {
        if (this.isBroken) return; // Prevent multiple triggers
        this.isBroken = true;
        this.currentImageIndex = 0;
        this.speedY = 0; // Stop falling
        if (!GLOBAL_MUTE) {
            this.breakSound.play();
        }
        let breakIntervalId = setInterval(() => {
            const imagePath = this.IMAGES_BREAK[this.currentImageIndex];
            this.img = this.imageChache[imagePath];

            this.currentImageIndex++;
            if (this.currentImageIndex >= this.IMAGES_BREAK.length) {
                clearInterval(breakIntervalId);
            }
        }, 100);
    }
    /**
     * Applies custom gravity to the bottle.
     * Updates vertical position and reduces speedY over time.
     */
    applyBottleGravity() {
        this.gravityInterval = setInterval(() => {

            // 1. Apply gravity when rising OR falling
            if (this.isAboveGround() || this.speedY !== 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceeleration;
            }



        }, 1000 / 25);
    }


    /**
 * Starts the bottle throw.
 * Sets initial speed, gravity, sound, and rotation.
 */
    throw() {
        this.speedY = 30;
        this.applyBottleGravity()

        if (!GLOBAL_MUTE) {
            this.throwSound.play();
        }

        this.markAsFlownDelayed();

        this.startRotationInterval();
    }

    /**
     * Marks the bottle as "has flown" after a short delay
     * to prevent immediate collision with the player.
     */
    markAsFlownDelayed() {
        setTimeout(() => {
            this.hasFlown = true;
        }, 100);
    }

    /**
     * Starts the rotation interval that moves the bottle horizontally,
     * cycles rotation frames, updates the image, and triggers breaking
     * when the bottle hits the ground.
     */
    startRotationInterval() {
        this.rotationIntervalId = setInterval(() => {
            if (this.isBroken) return;

            this.updateHorizontalMovement();
            this.advanceRotationFrame();
            this.updateRotationImage();

            if (this.y > 350) {
                this.stopRotation();
                this.triggerBreakingAnimation();
            }
        }, 30);
    }

    /**
     * Moves the bottle horizontally based on its throw direction.
     */
    updateHorizontalMovement() {
        this.x += this.direction ? -10 : 10;
    }

    /**
     * Advances the rotation frame index and loops it when necessary.
     */
    advanceRotationFrame() {
        this.currentImageIndex++;
        if (this.currentImageIndex >= this.IMAGES_ROTATION.length) {
            this.currentImageIndex = 0;
        }
    }

    /**
     * Updates the bottle's current image based on the rotation frame.
     */
    updateRotationImage() {
        const imagePath = this.IMAGES_ROTATION[this.currentImageIndex];
        this.img = this.imageChache[imagePath];
    }


}