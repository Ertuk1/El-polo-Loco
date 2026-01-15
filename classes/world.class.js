/**
 * World class managing the game environment, entities, rendering, and game logic.
 * Handles collision detection, game state, and coordinates all game objects.
 */
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
    
    /**
     * Initializes the game world with all entities, UI elements, and game logic.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.muteButton = new MuteButton(this.canvas);
        this.mobileControls = new MobileControls(this.canvas, this.keyboard);
        this.bossIntroActive = false;
        this.setWorld();        
        this.bottleImage.src = 'IMG/6_salsa_bottle/salsa_bottle.png';
        this.bottles = [
            new Bottle(300, 380),
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
    this.bossHpBar = new BossStatusbar(endboss);
    endboss.target = this.character;

    this.sounds = [this.walkingSound, this.bottleThrowSound, this.chickenSound].filter(Boolean);
    
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.05;
    if (!GLOBAL_MUTE) {
        this.backgroundMusic.play().catch(e => {});
    }

    this.handleMuteChange = (event) => {
        const { muted } = event.detail;
        if (muted) {
            this.backgroundMusic.pause();
        } else {
            this.backgroundMusic.play().catch(e => {});
        }
    };
    document.addEventListener('globalMuteChanged', this.handleMuteChange);
    }

    /**
     * Pauses the game by stopping game logic and showing pause screen.
     */
    pause() {
        if (this.isPaused) return;
        this.isPaused = true;
        GLOBAL_PAUSE = true;

        document.querySelectorAll("audio").forEach(a => a.pause());
        if (this.backgroundMusic) this.backgroundMusic.pause();
        if (this.character && this.character.snore) this.character.snore.pause();
        
        this.pauseScreen.show();
    }

    /**
     * Resumes the game by restarting game logic and hiding pause screen.
     */
    resume() {
        if (!this.isPaused) return;
        this.isPaused = false;
        GLOBAL_PAUSE = false;

        this.pauseScreen.hide();

        if (!GLOBAL_MUTE && this.backgroundMusic) {
            this.backgroundMusic.play().catch(e => {});
        }

        if (this.character && this.character.snorePlayed && !GLOBAL_MUTE) {
            this.character.snore.play().catch(e => {});
        }
    }

    /**
     * Starts the game by initiating draw and run loops.
     */
    start() {
        this.draw();
        this.run();
    }

    /**
     * Checks if character is dead and triggers game over sequence.
     */
    checkGameOver() {
        if (this.gameOverShown || !this.character.isDead()) return;

        setTimeout(() => {
            this.stop();
            
            this.gameoversound.currentTime = 0;
            if (!GLOBAL_MUTE) {
                this.gameoversound.play();
            }
            this.gameOverShown = true;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            const gameOverScreen = new GameOverScreen(this.canvas, {
                replay: (newCanvas) => startGame(newCanvas),
                home: (newCanvas) => showStartScreen()
            });
            gameOverScreen.show();
        }, 1000);
    }

    /**
     * Checks character proximity to endboss and triggers boss intro sequence.
     */
    checkEndbossProximity() {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

        if (endboss) {
            if (!this.bossHpBar.boss) {
                this.bossHpBar.setBoss(endboss);
            }

            if (this.character.x >= 2000 && !this.bossIntroTriggered) {
                this.bossIntroTriggered = true;
                this.bossHpBarVisible = true;
                this.bossIntroActive = true;

                setTimeout(() => {
                    endboss.isWalking = true;
                    this.bossIntroActive = false;
                }, 3000);
            }
        }
    }

    /**
     * Runs boss-related game logic at high frequency.
     */
    runboss() {
        setInterval(() => {
            if (this.isPaused) return;
            this.checkCollisions();
            this.checkThrowobjects();
            this.checkEndbossProximity();
            this.checkGameOver() ;
        }, 10);
    }

    /**
     * Increments bottle count and updates bottle status bar.
     */
    collectBottle() {
        this.bottleCount += 1;
        let percentage = (this.bottleCount / this.totalBottles) * 100;
        this.bottleStatusBar.setPercentage(percentage);
    }

    /**
     * Decrements bottle count when thrown and updates bottle status bar.
     */
    throwBottleUpdate() {
        this.bottleCount--;
        let percentage = (this.bottleCount / this.totalBottles) * 100;
        this.bottleStatusBar.setPercentage(percentage);
    }

    /**
     * Increments coin count and updates coin status bar.
     */
    collectCoin() {
        this.coinsCount += 1;
        let percentage = (this.coinsCount / this.totalCoins) * 100;
        this.coinStatusBar.setPercentage(percentage);
    }

    /**
     * Runs main game logic loop for collisions and throwing.
     */
    run(){
        this.intervalId = setInterval(() => {
            if (this.isPaused) return;
            this.checkCollisions();
            this.checkThrowobjects();
        }, 50);
    }

    /**
     * Stops all game loops, audio, and cleans up resources.
     */
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

    /**
     * Checks for bottle throw input and creates throwable object.
     */
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

    /**
     * Checks if character is touching the endboss and applies damage.
     */
    checkEndbossTouch() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && this.character.isColliding(endboss)) {
            this.character.hit(15);
            this.statusbar.setPercentage(this.character.energy);
        }
    }

    /**
     * Checks for coin pickups and handles collection.
     */
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

    /**
     * Checks for bottle pickups and handles collection.
     */
    checkBottlePickups() {
        this.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles.splice(index, 1);
                this.collectBottle();
            }
        });
    }

    /**
     * Checks if thrown bottles hit the boss and applies damage.
     */
    checkBottleBossHits() {
        this.throwableObjects.forEach((bottle, index) => {
            if (this.level.enemies[0].isColliding(bottle)) {
                this.bossHpBar.update();
                this.level.enemies[0].hit(20);
                this.throwableObjects.splice(index, 1);
            }
        });
    }

    /**
     * Handles collision logic for chicken enemies (jump kill or damage).
     * @param {moveableObject} enemy - The enemy colliding with character.
     */
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

    /**
     * Routes enemy collision to appropriate handler.
     * @param {moveableObject} enemy - The enemy to check collision with.
     */
    checkEnemyCollision(enemy) {
        if (!this.character.isColliding(enemy)) return;

        if (enemy instanceof chicken || enemy instanceof SmallChicken) {
            this.handleChickenCollision(enemy);
        } else {
            this.character.hit(enemy);
            this.statusbar.setPercentage(this.character.energy);
        }
    }

    /**
     * Checks all collision types in the game world.
     */
    checkCollisions() {
        this.level.enemies.forEach(e => this.checkEnemyCollision(e));
        this.checkBottleBossHits();
        this.checkBottlePickups();
        this.checkCoinPickups();
        this.checkEndbossTouch();
    }

    /**
     * Sets the world reference in the character object.
     */
    setWorld(){
        this.character.world = this
    }

    /**
     * Main rendering loop that draws all game elements to canvas.
     */
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
        this.addToMap(this.character)
        this.addObjectsToMap(this.level.enemies)
        this.addObjectsToMap(this.throwableObjects)

        this.ctx.translate(-this.camera_x, 0)
        
        this.ctx.restore();  
        if (this.isPaused) {
        this.pauseScreen.draw();
        }
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Adds an array of objects to the rendering map.
     * @param {Array} objects - Array of drawable objects.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            if (!o.isDead || o.isDead) {
                this.addToMap(o);
            }
        });
    }

    /**
     * Adds a single moveable object to the rendering map with flipping support.
     * @param {moveableObject} mo - The moveable object to render.
     */
    addToMap(mo){
            if(mo.otherDirection){
               this.flipImage(mo); 
            }

            mo.draw(this.ctx);
            
            if(mo.otherDirection){
                this.flipImageBack(mo);
            }
    }

    /**
     * Flips the canvas context horizontally for mirrored rendering.
     * @param {moveableObject} mo - The object to flip.
     */
    flipImage(mo){
        this.ctx.save()
        this.ctx.translate(mo.width,0)
        this.ctx.scale(-1, 1)
        mo.x = mo.x * -1;
    }

    /**
     * Restores canvas context after flipping.
     * @param {moveableObject} mo - The object to restore.
     */
    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Displays the victory screen when player defeats the boss.
     */
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