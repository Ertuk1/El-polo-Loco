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
    gameoversound = new Audio('audio/gameover.mp3');
    backgroundMusic = new Audio('audio/BackgroundMusic.mp3');
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
    gameOverShown = false;
    

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.muteButton = new MuteButton(this.canvas);
        this.mobileControls = new MobileControls(this.canvas, this.keyboard);
        this.bossIntroActive = false; // Flag to control boss intro sequence
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
    endboss.target = this.character; // Set the character as the target for facing direction

    this.sounds = [this.walkingSound, this.bottleThrowSound, this.chickenSound].filter(Boolean);
    
    // Start background music
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3; // Set to a reasonable volume
    if (!GLOBAL_MUTE) {
        this.backgroundMusic.play().catch(e => console.log('Background music play failed:', e));
    }

    // Listen for mute changes to control background music
    this.handleMuteChange = (event) => {
        const { muted } = event.detail;
        if (muted) {
            this.backgroundMusic.pause();
        } else {
            this.backgroundMusic.play().catch(e => console.log('Background music play failed:', e));
        }
    };
    document.addEventListener('globalMuteChanged', this.handleMuteChange);
    
    this.draw();
    this.run();
    }

checkGameOver() {
    // Prevent multiple triggers
    if (this.gameOverShown || !this.character.isDead()) return;

    

    // Wait 2 seconds for death animation before showing the Game Over screen
    setTimeout(() => {
        // Stop the game loop cleanly
        this.stop();
        
        this.gameoversound.currentTime = 0;
        if (!GLOBAL_MUTE) {
            this.gameoversound.play();
        }
        this.gameOverShown = true;

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Show the Game Over screen
        const gameOverScreen = new GameOverScreen(this.canvas, {
            replay: (newCanvas) => startGame(newCanvas),
            home: (newCanvas) => showStartScreen()
        });
        gameOverScreen.show();
    }, 1000);
}

    checkEndbossProximity() {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

        if (endboss) {
            if (!this.bossHpBar.boss) {
                this.bossHpBar.setBoss(endboss);
            }

            // Trigger Endboss animation once when character reaches x position (e.g., 2000)
            if (this.character.x >= 2000 && !this.bossIntroTriggered) {
                this.bossIntroTriggered = true; // ensure this intro runs only once
                this.bossHpBarVisible = true;
                this.bossIntroActive = true; // Lock character movement during intro

                setTimeout(() => {
                    endboss.isWalking = true;
                    this.bossIntroActive = false; // Allow character movement after intro
                }, 3000); // Delay by 3 seconds
            }
        }
    }

    runboss() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowobjects();
            this.checkEndbossProximity();  // Continuously check character position
            this.checkGameOver() ;
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
        this.intervalId = setInterval(() => {
            this.checkCollisions();
            this.checkThrowobjects();
        }, 50);
    }

    stop() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        if (this.intervalId) clearInterval(this.intervalId);
        const pauseResetAudio = a => { a.pause(); a.currentTime = 0; };
        document.querySelectorAll("audio").forEach(pauseResetAudio);
        if (this.backgroundMusic) pauseResetAudio(this.backgroundMusic);
        if (this.handleMuteChange) document.removeEventListener('globalMuteChanged', this.handleMuteChange);
        if (this.mobileControls && this.mobileControls.remove) this.mobileControls.remove();
        if (this.character && this.character.stop) this.character.stop();
        const stopIf = obj => { if (obj && typeof obj.stop === 'function') obj.stop(); };
        const stopCollection = coll => { if (coll) coll.forEach(item => stopIf(item)); };
        stopCollection(this.level && this.level.enemies);
        stopCollection(this.bottles);
        stopCollection(this.coins);
        stopCollection(this.throwableObjects);
    }

    checkThrowobjects() {
        if (this.keyboard.D && !this.throwCooldown && !this.bossIntroActive) {
            if (this.bottleCount < 1) {
                return null;
            }
            this.throwBottleUpdate()
            let bottleX = this.character.otherDirection ? this.character.x - 50 : this.character.x + 100;
            let bottle = new ThrowableObject(bottleX, this.character.y + 150, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.throwCooldown = true;
            setTimeout(() => {
                this.throwCooldown = false;
            }, 1500);  
        }
    }

checkEndbossTouch() {
    const endboss = this.level.enemies.find(e => e instanceof Endboss);
    if (endboss && this.character.isColliding(endboss)) {
        this.character.hit(15);
        this.statusbar.setPercentage(this.character.energy);
    }
}


checkCoinPickups() {
    this.coins.forEach((coin, index) => {
        if (this.character.isColliding(coin)) {
            this.collectCoin();

            const s = this.character.collectSound.cloneNode();
            s.volume = this.character.collectSound.volume;
            if (!GLOBAL_MUTE) s.play();

            this.coins.splice(index, 1);
        }
    });
}


checkBottlePickups() {
    this.bottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle)) {
            this.bottles.splice(index, 1);
            this.collectBottle();
        }
    });
}


checkBottleBossHits() {
    this.throwableObjects.forEach((bottle, index) => {
        if (this.level.enemies[0].isColliding(bottle)) {
            this.bossHpBar.update();
            this.level.enemies[0].hit(20);
            this.throwableObjects.splice(index, 1);
        }
    });
}


handleChickenCollision(enemy) {
    const characterBottom = this.character.y + this.character.height;
    const isAbove = characterBottom < enemy.y + 30;
    const isFalling = this.character.speedY < 0;

    if (isAbove && isFalling) {
        if (enemy instanceof chicken && !GLOBAL_MUTE) {
            this.chickenSound.play();
        }
        enemy.die();
    } else {
        this.character.hit(enemy);
        this.statusbar.setPercentage(this.character.energy);
    }
}



checkEnemyCollision(enemy) {
    if (!this.character.isColliding(enemy)) return;

    if (enemy instanceof chicken || enemy instanceof SmallChicken) {
        this.handleChickenCollision(enemy);
    } else {
        this.character.hit(enemy);
        this.statusbar.setPercentage(this.character.energy);
    }
}


checkCollisions() {
    this.level.enemies.forEach(e => this.checkEnemyCollision(e));
    this.checkBottleBossHits();
    this.checkBottlePickups();
    this.checkCoinPickups();
    this.checkEndbossTouch();
}


    setWorld(){
        this.character.world = this
    }

    draw() {
        if (this.victoryShown || this.gameOverShown) return;
        
        const scaleX = this.canvas.width / 720;
        const scaleY = this.canvas.height / 480;
        
        this.ctx.save();
        this.ctx.scale(scaleX, scaleY);

        this.ctx.clearRect(0,0, 720, 480)

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

        this.muteButton.draw();

        if ('ontouchstart' in window) {
            this.mobileControls.draw(this.ctx);
        }
    
        this.ctx.translate(this.camera_x, 0)
        //Fixed ITEMS
        this.addToMap(this.character)
        this.addObjectsToMap(this.level.enemies)
        this.addObjectsToMap(this.throwableObjects)

        this.ctx.translate(-this.camera_x, 0)
        
        this.ctx.restore();  
         this.animationFrameId = requestAnimationFrame(() => this.draw());
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


    showVictoryScreen() {
    this.victoryShown = true;
    
    document.querySelectorAll("audio").forEach(a => a.muted = true);

    this.stop();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.victoryScreen = new VictoryScreen(this.canvas, {
        replay: () => {
            const newCanvas = recreateCanvas();
            startGame(newCanvas);
        },
        home: () => {
            const newCanvas = recreateCanvas();
            showStartScreen();
        }
    });

    this.victoryScreen.show();
}

}