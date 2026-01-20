class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    checkAll() {
        const w = this.world;
        if (w.character.isDead() || w.gameOverShown) return;

        w.level.enemies.forEach(enemy => this.checkEnemyCollision(enemy));
        this.checkBottleBossHits();
        this.checkBottlePickups();
        this.checkCoinPickups();
        this.checkEndbossTouch();
    }

    // -----------------------------
    // Enemy collisions
    // -----------------------------
    checkEnemyCollision(enemy) {
        const w = this.world;

       
        if (w.character.isColliding(enemy, 5, 0, 5, 0) && this.isJumpKill(enemy)) {
            if (!(enemy instanceof Endboss)) w.character.bounce();
            this.playChickenSound(enemy);
            enemy.die();
            return;
        }

       
        if (w.character.isColliding(enemy, 15, 15, 15, 15)) {
            this.damageCharacter();
        }
    }

    isJumpKill(enemy) {
        const w = this.world;
        const characterBottom = w.character.y + w.character.height;
        const isAbove = characterBottom < enemy.y + 30;
        const isFalling = w.character.speedY < 0;
        return isAbove && isFalling;
    }

    playChickenSound(enemy) {
        const w = this.world;
        if (enemy instanceof chicken && !GLOBAL_MUTE) {
            w.chickenSound.play();
        }
    }

    damageCharacter() {
        const w = this.world;
        w.character.hit(25);
        w.statusbar.setPercentage(w.character.energy);
    }

    // -----------------------------
    // Bottle collisions
    // -----------------------------
    checkBottlePickups() {
        const w = this.world;

        w.bottles.forEach((bottle, index) => {
            if (w.character.isColliding(bottle, 20, 20, 20, 20)) {
                w.bottles.splice(index, 1);
                w.collectBottle();
            }
        });
    }


checkBottleBossHits() {
    const w = this.world;
    const endboss = w.level.enemies.find(e => e instanceof Endboss);
    if (!endboss) return;

    w.throwableObjects.forEach(bottle => {

        // Bottle must be flying and not broken
        if (bottle.isBroken || !bottle.hasFlown) return;

        // Bottle must be in front of the boss (not behind)
        const bottleInFront = bottle.x + bottle.width > endboss.x + 20;

        // Bottle must be at a reasonable height (not hitting feet)
        const correctHeight = bottle.y + bottle.height > endboss.y + 40;

        // Actual collision check
        const hit = endboss.isColliding(bottle);

        if (hit && bottleInFront && correctHeight) {

            bottle.stopRotation();
            bottle.triggerBreakingAnimation();
            w.bossHpBar.update();
            endboss.hit(20);

            setTimeout(() => {
                const idx = w.throwableObjects.indexOf(bottle);
                if (idx > -1) w.throwableObjects.splice(idx, 1);
            }, 600);
        }
    });
}


    // -----------------------------
    // Coin collisions
    // -----------------------------
    checkCoinPickups() {
        const w = this.world;

        w.coins.forEach((coin, index) => {
            if (w.character.isColliding(coin, 30, 30, 30, 30)) {
                w.collectCoin();
                const s = w.character.collectSound.cloneNode();
                s.volume = w.character.collectSound.volume;
                s.currentTime = 0.5;
                if (!GLOBAL_MUTE) s.play();
                w.coins.splice(index, 1);
            }
        });
    }

    // -----------------------------
    // Endboss touch
    // -----------------------------
    checkEndbossTouch() {
        const w = this.world;
        const endboss = w.level.enemies.find(e => e instanceof Endboss);
        if (!endboss) return;

        if (w.character.isColliding(endboss)) {
            w.character.hit(25);
            w.statusbar.setPercentage(w.character.energy);
        }
    }
}
