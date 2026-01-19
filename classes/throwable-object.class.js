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
    
throw() {
    this.speedY = 30;
    this.applyGravity();
    
    if (!GLOBAL_MUTE) {
        this.throwSound.play();
    }
    
    // Mark as "has flown" after 100ms to avoid instant collision
    setTimeout(() => {
        this.hasFlown = true;
    }, 100);
    
    this.rotationIntervalId = setInterval(() => {
        if (this.isBroken) return;
        
        this.x += this.direction ? -10 : 10;
        
        this.currentImageIndex++;
        if (this.currentImageIndex >= this.IMAGES_ROTATION.length) {
            this.currentImageIndex = 0;
        }
        
        const imagePath = this.IMAGES_ROTATION[this.currentImageIndex];
        this.img = this.imageChache[imagePath];
        
        if (this.y > 236) {
            this.stopRotation();
            this.triggerBreakingAnimation();
        }
    }, 30);
}
}