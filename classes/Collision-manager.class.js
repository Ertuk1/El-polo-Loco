/**
 * Creates a new CollisionManager responsible for handling all collision logic in the game world.
 * @param {World} world - The active game world containing the character, enemies, items, and level data.
 */

class CollisionManager {
    constructor(world) {
        this.world = world;
    }



    /**
 * Runs all collision checks for the current frame.
 * Skips processing if the character is dead or the game over screen is already shown.
 */

    checkAll() {
        const w = this.world;
        if (w.character.isDead() || w.gameOverShown) return;

        w.level.enemies.forEach(enemy => this.checkEnemyCollision(enemy));
        this.checkBottleBossHits();
        this.checkBottlePickups();
        this.checkCoinPickups();
        this.checkEndbossTouch();
        this.checkBottleEnemyHits();

    }
    /**
* Checks whether any thrown bottle collides with regular enemies.
* If a bottle hits a non-boss enemy, the bottle breaks and the enemy dies.
* Boss collisions are excluded and handled separately in checkBottleBossHits().
*/

    checkBottleEnemyHits() {
        const w = this.world;

        w.throwableObjects.forEach(bottle => {
            if (bottle.isBroken || !bottle.hasFlown) return;

            w.level.enemies.forEach(enemy => {
                if (enemy instanceof Endboss) return; 

                if (enemy.isColliding(bottle)) {
                    bottle.stopRotation();
                    bottle.triggerBreakingAnimation();
                    enemy.die();
                    this.playChickenSound(enemy);

                    setTimeout(() => {
                        const idx = w.throwableObjects.indexOf(bottle);
                        if (idx > -1) w.throwableObjects.splice(idx, 1);
                    }, 600);
                }
            });
        });
    }


    /**
 * Checks collision between the character and a single enemy.
 * Handles jump-kills, enemy death, bounce effects, and character damage.
 * @param {Enemy} enemy - The enemy to test collision against.
 */

    checkEnemyCollision(enemy) {
        const w = this.world;
        if (enemy.isDead || enemy.collidable === false) return;

        if (w.character.isColliding(enemy) && this.isJumpKill(enemy)) {
            if (!(enemy instanceof Endboss)) w.character.bounce();
            this.playChickenSound(enemy);
            enemy.die();
            return;
        }

        if (w.character.isColliding(enemy)) {
            this.damageCharacter();
        }
    }

    /**
 * Determines whether the character is performing a jump-kill on an enemy.
 * A jump-kill occurs when the character is above the enemy and falling downward.
 * @param {Enemy} enemy - The enemy being evaluated.
 * @returns {boolean} True if the enemy should be killed by a jump.
 */

    isJumpKill(enemy) {
        const w = this.world;
        const characterBottom = w.character.y + w.character.height;
        const isAbove = characterBottom < enemy.y + 30;
        const isFalling = w.character.speedY < 0;
        return isAbove && isFalling;
    }

    /**
 * Plays the chicken death sound if the enemy is a chicken and global sound is not muted.
 * @param {Enemy} enemy - The enemy that may trigger the sound.
 */

    playChickenSound(enemy) {
        const w = this.world;
        if (enemy instanceof chicken && !GLOBAL_MUTE) {
            w.chickenSound.play();
        }
    }

    /**
 * Applies damage to the character and updates the health status bar.
 */

    damageCharacter() {
        const w = this.world;
        w.character.hit(25);
        w.statusbar.setPercentage(w.character.energy);
    }

    /**
     * Checks for bottle pickups.
     * Removes bottles on collision and increases the player's bottle count.
     */
    checkBottlePickups() {
        const w = this.world;
        w.bottles.forEach((bottle, index) => {
            if (w.character.isColliding(bottle)) {
                w.bottles.splice(index, 1);
                w.collectBottle();
            }
        });
    }

    /**
     * Checks for collisions between the character and collectible bottles.
     * Removes collected bottles and triggers the bottle collection logic.
     */
    checkBottleBossHits() {
        const w = this.world;
        const endboss = w.level.enemies.find(e => e instanceof Endboss);
        if (!endboss) return;
        w.throwableObjects.forEach(bottle => {
            if (!this.isBottleValid(bottle, w)) return;
            const bottleInFront = this.isBottleInFrontOfBoss(bottle, endboss);
            const correctHeight = this.isBottleAtCorrectHeight(bottle, endboss);
            const isAboveBoss = bottle.y + bottle.height < endboss.y + 20;
            if (isAboveBoss) return;
            const hit = this.isBottleHittingBoss(bottle, endboss);
            if (hit && bottleInFront && correctHeight) {
                this.handleBossHit(bottle, w, endboss);
            }
        });
    }

    /**
 * Checks whether a thrown bottle hits the boss using a reduced, more precise hitbox.
 * Only the central body area of the boss is considered for collision detection.
 *
 * @param {Object} bottle - The thrown bottle object containing position and size.
 * @param {Object} boss - The boss object containing position and size.
 * @returns {boolean} True if the bottle intersects with the boss's reduced hitbox.
 */
    isBottleHittingBoss(bottle, boss) {
        const hitbox = {
            x: boss.x + boss.width * 0.25,
            y: boss.y + boss.height * 0.25,
            width: boss.width * 0.5,
            height: boss.height * 0.5
        };

        return (
            bottle.x < hitbox.x + hitbox.width &&
            bottle.x + bottle.width > hitbox.x &&
            bottle.y < hitbox.y + hitbox.height &&
            bottle.y + bottle.height > hitbox.y
        );
    }



    /**
     * Determines whether a bottle is eligible to hit the boss.
     * A bottle must be unbroken, already thrown, and have traveled a minimum distance.
     * @param {ThrowableObject} bottle - The bottle being evaluated.
     * @param {World} w - The game world for character position reference.
     * @returns {boolean} True if the bottle can be considered for a boss hit.
     */

    isBottleValid(bottle, w) {
        if (bottle.isBroken || !bottle.hasFlown) return false;

        const minTravelDistance = 80;
        const traveledEnough = Math.abs(bottle.x - w.character.x) > minTravelDistance;
        return traveledEnough;
    }
    /**
     * Checks whether the bottle is positioned in front of the boss horizontally.
     * @param {ThrowableObject} bottle - The bottle being evaluated.
     * @param {Endboss} endboss - The boss to compare against.
     * @returns {boolean} True if the bottle is in front of the boss.
     */

    isBottleInFrontOfBoss(bottle, endboss) {
        return bottle.x + bottle.width > endboss.x + 20;
    }
    /**
     * Checks whether the bottle is high enough to hit the boss.
     * @param {ThrowableObject} bottle - The bottle being evaluated.
     * @param {Endboss} endboss - The boss to compare against.
     * @returns {boolean} True if the bottle is at a valid impact height.
     */

    isBottleAtCorrectHeight(bottle, endboss) {
        return bottle.y + bottle.height > endboss.y + 40;
    }
    /**
     * Handles the effects of a successful bottle hit on the boss.
     * Stops bottle rotation, triggers breaking animation, updates the boss HP bar,
     * applies damage, and removes the bottle after a delay.
     * @param {ThrowableObject} bottle - The bottle that hit the boss.
     * @param {World} w - The game world containing the bottle list.
     * @param {Endboss} endboss - The boss receiving damage.
     */

    handleBossHit(bottle, w, endboss) {
        bottle.stopRotation();
        bottle.triggerBreakingAnimation();
        w.bossHpBar.update();
        endboss.hit(20);

        setTimeout(() => {
            const idx = w.throwableObjects.indexOf(bottle);
            if (idx > -1) w.throwableObjects.splice(idx, 1);
        }, 600);
    }


    /**
 * Checks for collisions between the character and coins.
 * Plays the collection sound, removes the coin, and updates coin count.
 */

    checkCoinPickups() {
        const w = this.world;

        w.coins.forEach((coin, index) => {
            if (w.character.isColliding(coin)) {
                w.collectCoin();
                const s = w.character.collectSound.cloneNode();
                s.volume = w.character.collectSound.volume;
                s.currentTime = 0.5;
                if (!GLOBAL_MUTE) s.play();
                w.coins.splice(index, 1);
            }
        });
    }

    /**
 * Checks whether the character touches the endboss.
 * Applies damage and updates the health bar if a collision occurs.
 */

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
