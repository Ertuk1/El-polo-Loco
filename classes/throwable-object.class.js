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
    ]

    currentImageIndex = 0;
    isBroken = false;
    breakSound = new Audio('audio/bottlecrack.mp3')
    throwSound = new Audio('audio/throw.mp3')

    constructor(x, y) {
        super().loadImage('IMG/6_salsa_bottle/salsa_bottle.png')
        this.x = x;
        this.y = y -100;
        this.height = 60;
        this.width = 50;
        this.trow();

    }


    trow() {
        this.speedY = 30;
        this.applyGravity();
        if (!GLOBAL_MUTE) {
            this.throwSound.play();
        }
    
        let intervalId = setInterval(() => {
            this.x += 10;  
            console.log(this.y)
           
            this.currentImageIndex++;
            if (this.currentImageIndex >= this.IMAGES_ROTATION.length) {
                this.currentImageIndex = 0;  
            }
            this.loadImage(this.IMAGES_ROTATION[this.currentImageIndex]);  
    
            
            if (this.y > 236) {  
                this.triggerBreakingAnimation();
                clearInterval(intervalId);  
            }
    
        }, 30);  
    }
    
    
    triggerBreakingAnimation() {
        this.isBroken = true;
        this.currentImageIndex = 0;
        if (!GLOBAL_MUTE) {
            this.breakSound.play();
        }  

        let breakIntervalId = setInterval(() => {
            
            this.loadImage(this.IMAGES_BREAK[this.currentImageIndex]);
            this.currentImageIndex++;

            if (this.currentImageIndex >= this.IMAGES_BREAK.length) {
                clearInterval(breakIntervalId);  
            }
        }, 100);  
    }
}