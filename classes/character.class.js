class Character extends moveableObject {

height=280;
y=155;
speed = 3.5;
idleTime = 0; 
lastActionTime = 0; 
lastHurtSoundTime = 0;
snorePlayed = false;

world;
walking_sound = new Audio('audio/running.mp3');
hurt = new Audio('audio/hurtsound.mp3')
snore = new Audio('audio/SnoreSound.mp3')
IMAGES_IDLE=[
    'IMG/2_character_pepe/1_idle/idle/I-1.png',
    'IMG/2_character_pepe/1_idle/idle/I-2.png',
    'IMG/2_character_pepe/1_idle/idle/I-3.png',
    'IMG/2_character_pepe/1_idle/idle/I-4.png',
    'IMG/2_character_pepe/1_idle/idle/I-5.png',
    'IMG/2_character_pepe/1_idle/idle/I-6.png',
    'IMG/2_character_pepe/1_idle/idle/I-7.png',
    'IMG/2_character_pepe/1_idle/idle/I-8.png',
    'IMG/2_character_pepe/1_idle/idle/I-9.png',
    'IMG/2_character_pepe/1_idle/idle/I-10.png'
]

IMAGES_LONG_IDLE = [
    'IMG/2_character_pepe/1_idle/long_idle/I-11.png',
    'IMG/2_character_pepe/1_idle/long_idle/I-12.png',
    'IMG/2_character_pepe/1_idle/long_idle/I-13.png',
    'IMG/2_character_pepe/1_idle/long_idle/I-14.png',
    'IMG/2_character_pepe/1_idle/long_idle/I-15.png',
    'IMG/2_character_pepe/1_idle/long_idle/I-16.png',
    'IMG/2_character_pepe/1_idle/long_idle/I-17.png',
    'IMG/2_character_pepe/1_idle/long_idle/I-18.png',
    'IMG/2_character_pepe/1_idle/long_idle/I-19.png',
    'IMG/2_character_pepe/1_idle/long_idle/I-20.png',
]

IMAGES_WALKING = [
    'IMG/2_character_pepe/2_walk/W-21.png',
    'IMG/2_character_pepe/2_walk/W-22.png',
    'IMG/2_character_pepe/2_walk/W-23.png',
    'IMG/2_character_pepe/2_walk/W-24.png',
    'IMG/2_character_pepe/2_walk/W-25.png',
    'IMG/2_character_pepe/2_walk/W-26.png'
]


IMAGES_JUMPING = [
    'IMG/2_character_pepe/3_jump/J-31.png',
    'IMG/2_character_pepe/3_jump/J-32.png',
    'IMG/2_character_pepe/3_jump/J-33.png',
    'IMG/2_character_pepe/3_jump/J-34.png',
    'IMG/2_character_pepe/3_jump/J-35.png',
    'IMG/2_character_pepe/3_jump/J-36.png',
    'IMG/2_character_pepe/3_jump/J-37.png',
    'IMG/2_character_pepe/3_jump/J-38.png',
    'IMG/2_character_pepe/3_jump/J-39.png',
]

IMAGES_DEAD = [
    'IMG/2_character_pepe/5_dead/D-51.png',
    'IMG/2_character_pepe/5_dead/D-52.png',
    'IMG/2_character_pepe/5_dead/D-53.png',
    'IMG/2_character_pepe/5_dead/D-54.png',
    'IMG/2_character_pepe/5_dead/D-55.png',
    'IMG/2_character_pepe/5_dead/D-56.png',
    //'IMG/2_character_pepe/5_dead/D-57.png'
]

IMAGES_HURT = [
    'IMG/2_character_pepe/4_hurt/H-41.png',
    'IMG/2_character_pepe/4_hurt/H-42.png',
    'IMG/2_character_pepe/4_hurt/H-43.png'
]

constructor(){
   super().loadImage('IMG/2_character_pepe/2_walk/W-21.png') 
   this.loadImages(this.IMAGES_WALKING)
   this.loadImages(this.IMAGES_JUMPING)
   this.loadImages(this.IMAGES_DEAD)
   this.loadImages(this.IMAGES_HURT)
   this.loadImages(this.IMAGES_HURT);
   this.loadImages(this.IMAGES_IDLE);
   this.loadImages(this.IMAGES_LONG_IDLE);
   this.animate();
   this.applyGravity();
   this.lastActionTime = Date.now();
   this.collectSound = new Audio('audio/collectcoin.mp3');
   this.collectSound.volume = 0.4;
   this.collectSound.currentTime = 0.9;
   this.jumpSound = new Audio('audio/jump.mp3');
   this.snore.addEventListener('ended', () => {
       if (this.snorePlayed && !GLOBAL_MUTE) {
           this.snore.play();
       }
   });
}

animate() {
    this.movementInterval = setInterval(() => {
        this.walking_sound.pause();

        const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT || 
                         this.world.keyboard.UP || this.world.keyboard.SPACE;

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            if (!GLOBAL_MUTE) {
                this.walking_sound.play();
            }
            this.resetIdleTimer();
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            if (!GLOBAL_MUTE) {
                this.walking_sound.play();
            }
            this.resetIdleTimer();
        }

        if ((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()) {
            this.jump();
            if (!GLOBAL_MUTE) {
                this.jumpSound.play();
            }
            this.resetIdleTimer();
        }

        if (!isMoving) {
            this.updateIdleTime();
        }

        this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.snore.pause();
            this.hurt.pause();
            this.speedY = 15;
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.snore.pause();
        
            const now = Date.now();
            if (now - this.lastHurtSoundTime > 1000) { // 1 second cooldown
                if (!GLOBAL_MUTE) {
                    this.hurt.play();
                }
                this.lastHurtSoundTime = now;}
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
            this.snore.pause();
            this.hurt.pause();
        } else if (this.idleTime >= 5000) { // Long idle after 2 seconds
            this.playAnimation(this.IMAGES_LONG_IDLE);
            if (!this.snorePlayed && !GLOBAL_MUTE) {
                this.snore.play();
            }
            this.snorePlayed = true;
            this.hurt.pause();
        } else if (this.idleTime > 0) { // Normal idle when not moving
            this.playAnimation(this.IMAGES_IDLE);
            this.snore.pause();
            this.hurt.pause();
        } else {
            this.playAnimation(this.IMAGES_WALKING);
            this.snore.pause();
            this.snorePlayed = false;
            this.hurt.pause();
        }
    }, 1000 / 10);
}

    jump(){
        this.speedY = 30;
      }



    resetIdleTimer() {
        this.idleTime = 0;
        this.lastActionTime = Date.now();
    }

    updateIdleTime() {
        if ( !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
            this.idleTime = Date.now() - this.lastActionTime;
        }
    }

    stop() {
        if (this.movementInterval) clearInterval(this.movementInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
        this.snore.pause();
        this.snorePlayed = false;
    }

}