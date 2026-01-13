class chicken extends moveableObject {
height = 70;
y = 365;
width = 80;
IMAGES_WALKING = [
    'IMG/3_enemies_chicken/chicken_normal/1_walk//1_w.png',
    'IMG/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'IMG/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
] 

IMAGES_DEAD = ['IMG/3_enemies_chicken/chicken_normal/2_dead/dead.png']
isDead = false;



constructor(x = null){
    super().loadImage('IMG/3_enemies_chicken/chicken_normal/1_walk//2_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.imageDead = this.loadImage('IMG/3_enemies_chicken/chicken_normal/2_dead/dead.png');
    this.x = x !== null ? x : 250 + Math.random() * 500;
    this.animate();
    this.isDead = false;
    this.speed = 0.15 + Math.random() * 0.25;

}


die() {
    this.isDead = true;  // Set chicken as dead
    this.speed = 0;  // Stop any movement
    this.loadImage(this.IMAGES_DEAD[0]);
    setTimeout(() => {
        this.removeFromWorld();  // Remove chicken from world after some time
    }, 1000);

}

removeFromWorld() {
    // You can either remove the object from the game world entirely or hide it
    this.x = -1000;  // Move it off-screen for simplicity
}


animate(){
    setInterval(() => {
    this.moveLeft();
    }, 1000 / 60);
    
    setInterval(() =>{
this.playAnimation(this.IMAGES_WALKING)
    }, 200)
}

}