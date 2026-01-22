/**
 * World class managing the game environment, entities, rendering, and game logic.
 * Handles collision detection, game state, and coordinates all game objects.
 */
class World {
    character = new Character();
    level = level1
    backgroundObjects = level1.backgroundObjects;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusbar = new StatusBar();
    throwableObjects = []
    isDead = false;
    chickenSound = new Audio('audio/chicken.mp3')
    gameoversound = new Audio('audio/gameover.mp3');
    bottles = [];
    bottleCount = 0;
    bottleImage = new Image('')
    coinImage = new Image('')
    coins = [];
    coinsCount = 0;
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();
    bossHpBar = new BossStatusbar(this.level.enemies[0]);
    bossHpBarVisible = false;
    gameOverShown = false;
    keyboard = new Keyboard();

    /**
     * Initializes the game world with all entities, UI elements, and game logic.
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.renderer = new RenderingManager(this);
        this.collisionManager = new CollisionManager(this);
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




    };

    /**
     * Pauses the game by stopping game logic and showing pause screen.
     */
    pause() {
        if (this.isPaused) return;

        this.isPaused = true;
        GLOBAL_PAUSE = true;

        MUSIC.pause();

        if (this.character?.snore) {
            this.character.snore.pause();
        }

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


        MUSIC.resume();

        if (this.character?.snorePlayed && !GLOBAL_MUTE) {
            this.character.snore.play().catch(() => { });
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
            MUSIC.stop();
            if (!GLOBAL_MUTE) {
                this.gameoversound.play();
            }

            this.gameOverShown = true;
            new GameOverScreen(this.canvas, {
                replay: startGame,
                home: showStartScreen
            }).show();
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
        if (this.character.isDead() || this.gameOverShown) return;
        setInterval(() => {
            if (this.isPaused) return;
            this.checkCollisions();
            this.checkThrowobjects();
            this.checkEndbossProximity();
            this.checkGameOver();
        }, 10);
    }

    /**
     * Increments bottle count and updates bottle status bar.
     */
    collectBottle() {
        this.bottleCount += 1;
        let percentage = Math.round((this.bottleCount / this.totalBottles) * 5) * 20;
        this.bottleStatusBar.setPercentage(percentage);

    }

    /**
     * Decrements bottle count when thrown and updates bottle status bar.
     */
    throwBottleUpdate() {
        this.bottleCount--;
        let percentage = (this.bottleCount / this.totalBottles) * 100;
        this.bottleStatusBar.setPercentage(percentage);
        this.character.resetIdleTimer();
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
    run() {
        if (this.character.isDead() || this.gameOverShown) return;
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
        this.stopMainLoops();
        this.stopAllAudio();
        this.removeGlobalListeners();
        this.cleanupControls();
        this.stopCharacter();
        this.stopCollections();
        this.stopEndboss();
    }


    /**
     * Cancels animation frames and clears all running intervals.
     */
    stopMainLoops() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.bossInterval) clearInterval(this.bossInterval);
    }

    /**
     * Pauses and resets all audio elements in the document.
     */
    stopAllAudio() {
        const pauseReset = audio => {
            audio.pause();
            audio.currentTime = 0;
        };
        document.querySelectorAll("audio").forEach(pauseReset);
    }

    /**
     * Removes global event listeners such as mute-change handlers.
     */
    removeGlobalListeners() {
        if (this.handleMuteChange) {
            document.removeEventListener('globalMuteChanged', this.handleMuteChange);
        }
    }

    /**
     * Cleans up mobile controls if they exist and support removal.
     */
    cleanupControls() {
        if (this.mobileControls && this.mobileControls.remove) {
            this.mobileControls.remove();
        }
    }

    /**
     * Stops the main character if a stop() method is available.
     */
    stopCharacter() {
        if (this.character && typeof this.character.stop === 'function') {
            this.character.stop();
        }
    }

    /**
     * Stops all objects in relevant collections (enemies, bottles, coins, throwable objects).
     */
    stopCollections() {
        const stopIf = obj => {
            if (obj && typeof obj.stop === 'function') obj.stop();
        };

        const stopCollection = coll => {
            if (coll) coll.forEach(item => stopIf(item));
        };

        stopCollection(this.level && this.level.enemies);
        stopCollection(this.bottles);
        stopCollection(this.coins);
        stopCollection(this.throwableObjects);
    }

    /**
     * Finds and stops the Endboss instance if present.
     */
    stopEndboss() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && typeof endboss.stop === 'function') {
            endboss.stop();
        }
    }





    /**
     * Checks for bottle throw input and creates throwable object.
     */
    checkThrowobjects() {
        if (this.keyboard.D && !this.throwCooldown && !this.bossIntroActive) {
            if (this.bottleCount < 1) {
                return;
            }
            this.throwBottleUpdate();
            let bottleX = this.character.otherDirection ? this.character.x - 50 : this.character.x + 100;
            let bottle = new ThrowableObject(bottleX, this.character.y + 150, this.character.otherDirection);
            this.throwableObjects.push(bottle);

            // Set cooldown
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
        if (this.character.isDead() || this.gameOverShown) return;
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (endboss && this.character.isColliding(endboss)) {
            this.character.hit(25);
            this.statusbar.setPercentage(this.character.energy);
        }
    }


    /**
     * Checks all collision types in the game world.
     */
    checkCollisions() {
        this.collisionManager.checkAll();
    }

    /**
     * Sets the world reference in the character object.
     */
    setWorld() {
        this.character.world = this
    }

    /**
     * Main rendering loop that draws all game elements to canvas.
     */
    draw() {
        this.renderer.draw();
    }

    /**
     * Displays the victory screen when player defeats the boss.
     */
    showVictoryScreen() {
        this.victoryShown = true;
        this.stop();
        MUSIC.stop();

        new VictoryScreen(this.canvas, {
            replay: () => { startGame(recreateCanvas()); MUSIC.play(); }, // <-- works here },
            home: () => showStartScreen(recreateCanvas())
        }).show();
    }


}