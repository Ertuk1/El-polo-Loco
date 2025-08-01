class World {
    character = new Character();
    level= level1
    backgroundObjects = level1.backgroundObjects;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusbar = new StatusBar();
    throwableObjects = [ ]
    isDead = false;
    chickenSound = new Audio('audio/chicken.mp3')
    bottles = [];
    bottleCount = 0;
    bottleImage = new Image('')
    coinImage = new Image ('')
    coins = [];
    coinsCount = 0 ;
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();
    bossHpBar = new BossStatusbar(this.level.enemies[0]);
    bossHpBarVisible = false;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.bottleImage.src = 'IMG/6_salsa_bottle/salsa_bottle.png';
        this.bottles = [
            new Bottle(300, 380),  // Bottle at (300, 250)
            new Bottle(600, 380),
            new Bottle(900, 380),
            new Bottle(1200, 380),
            new Bottle(1500, 380),
            new Bottle(1800, 380),
        ];
        this.bossHpBarVisible = false;
        this.coins = [
            new Coins(300, 80),
            new Coins(600, 80),
            new Coins(900, 80),
            new Coins(1200, 80),
            new Coins(1500, 80),
        ]
        this.totalCoins = this.coins.length;
        this.totalBottles = this.bottles.length;  
        this.bottleCount = 0;  
        this.runboss();
    const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    this.bossHpBar = new BossStatusbar(endboss); // Initialize with the boss
    }

    checkEndbossProximity() {
        
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        
        if (endboss) {

            if (!this.bossHpBar.boss) {
                this.bossHpBar.setBoss(endboss);
            }

            // Trigger Endboss animation if character reaches x position (e.g., 2000)
            if (this.character.x >= 2000 ) {
                this.bossHpBarVisible=true;;
                
                setTimeout(() => {
                   
                    endboss.isWalking = true;
                    
                }, 3000);  // Delay by 3 seconds
            }
        } 
    }

    runboss() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowobjects();
            this.checkEndbossProximity();  // Continuously check character position
        }, 10);
    }

    collectBottle() {
        this.bottleCount += 1;  // Increment collected bottle count
        let percentage = (this.bottleCount / this.totalBottles) * 100;  // Calculate percentage
        this.bottleStatusBar.setPercentage(percentage);  // Update the bottle status bar
    }

    throwBottleUpdate() {
        this.bottleCount--;  // Increment collected bottle count
        let percentage = (this.bottleCount / this.totalBottles) * 100;  // Calculate percentage
        this.bottleStatusBar.setPercentage(percentage);  // Update the bottle status bar
    }

    collectCoin() {
        this.coinsCount += 1;  // Increment coin count when a coin is collected
        let percentage = (this.coinsCount / this.totalCoins) * 100;  // Calculate the percentage
        this.coinStatusBar.setPercentage(percentage);  // Update the coin status bar
    }

    run(){
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowobjects();
        }, 200);
    }

    checkThrowobjects() {
        if (this.keyboard.D && !this.throwCooldown) {
            if (this.bottleCount < 1) {
                return null;
            }
            this.throwBottleUpdate()
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 150);
            this.throwableObjects.push(bottle);
            
                
            this.throwCooldown = true;
    
            setTimeout(() => {
                this.throwCooldown = false;
            }, 1500);  
        }
    }

    checkCollisions() {
        // Check collision with enemies (as before)
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (enemy instanceof chicken) {
                    const characterBottom = this.character.y + this.character.height;
                    const chickenTop = enemy.y;
                    const isAbove = characterBottom < chickenTop + 30;
                    const isFalling = this.character.speedY < 0; // <- important fix!

    if (isAbove && isFalling) {
        this.chickenSound.play();
        console.log('Character jumped on chicken');
        enemy.die();
                    } else {
                        console.log('Character collided with chicken');
                        this.character.hit(enemy);
                        this.statusbar.setPercentage(this.character.energy);
                    }
                } else {
                    console.log('collision with Character', this.character.energy);
                    this.character.hit(enemy);
                    this.statusbar.setPercentage(this.character.energy);
                }
            }
        });
        
        this.throwableObjects.forEach((bottle, index) => {
            if (this.level.enemies[0].isColliding(bottle)) {
                console.log('Bottle hit the Endboss!');
                this.bossHpBar.update();
                this.level.enemies[0].hit(20);  
                this.throwableObjects.splice(index, 1);  // Remove the bottle after collision
            }
        });

        // Check collision with bottles
        this.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                console.log('Bottle collected!');
                this.bottles.splice(index, 1);  // Remove bottle from the array
                this.collectBottle()
            }
        });

        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin()
                this.character.speed += 0.5;
                console.log('Coin collected!');
                this.coins.splice(index, 1);  // Remove coin from the array
                
            }
        });

            // Check collision with the Endboss
    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss); // Assuming the Endboss is in `level.enemies`
    if (endboss && this.character.isColliding(endboss)) {
        console.log('Character collided with the Endboss!');
        this.character.hit(15); // Reduce character's energy (default 25 or Endboss-specific damage)
        this.statusbar.setPercentage(this.character.energy);
    }

 
    }

    setWorld(){
        this.character.world = this
    }

    draw() {
        this.ctx.clearRect(0,0, canvas.width, canvas.height)

        this.ctx.translate(this.camera_x, 0)
        this.addObjectsToMap(this.level.backgroundObjects)
        this.addObjectsToMap(this.level.clouds)
        this.addObjectsToMap(this.bottles)
        this.addObjectsToMap(this.coins)

        this.ctx.translate(-this.camera_x, 0)
        
        
        //FIXED ITEMS
        this.addToMap(this.bottleStatusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.statusbar);
        if(this.bossHpBarVisible == true){
        this.addToMap(this.bossHpBar);}
    
        this.ctx.translate(this.camera_x, 0)
        //Fixed ITEMS

        
        this.addToMap(this.character)
        this.addObjectsToMap(this.level.enemies)
        this.addObjectsToMap(this.throwableObjects)

        this.ctx.translate(-this.camera_x, 0)

        self = this
        requestAnimationFrame(function(){
            self.draw();
        })
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            if (!o.isDead || o.isDead) {  // This will ensure dead chickens are still rendered
                this.addToMap(o);
            }
        });
    }

    addToMap(mo){
            if(mo.otherDirection){
               this.flipImage(mo); 
            }

            mo.draw(this.ctx);

            mo.drawFrame(this.ctx);
            
            if(mo.otherDirection){
                this.flipImageBack(mo);
                
            }
       
    }

    flipImage(mo){
        this.ctx.save()
        this.ctx.translate(mo.width,0)
        this.ctx.scale(-1, 1)
        mo.x = mo.x * -1;
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }


    

}