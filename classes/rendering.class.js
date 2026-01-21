    class RenderingManager {
        constructor(world) {
            this.world = world;
            this.canvas = world.canvas;
            this.ctx = world.ctx;
        }

        /**
     * Renders the entire game frame, including background, UI, foreground,
     * and optional overlays such as mobile controls or pause screen.
     */
    draw() {
        const w = this.world;
        if (w.victoryShown || w.gameOverShown) return;

        this.applyScaling();
        this.renderBackgroundLayer();
        this.renderUILayer();
        this.renderForegroundLayer();
        this.renderMobileControls();
        this.ctx.restore();

        if (w.isPaused) w.pauseScreen.draw();
    }

        /**
     * Applies canvas scaling based on the game's fixed internal resolution.
     * Saves the current context state and clears the scaled drawing area.
     */
    applyScaling() {
        const scaleX = this.canvas.width / 720;
        const scaleY = this.canvas.height / 480;

        this.ctx.save();
        this.ctx.scale(scaleX, scaleY);
        this.ctx.clearRect(0, 0, 720, 480);
    }

        /**
     * Renders all background elements including parallax layers,
     * clouds, bottles, and coins that appear behind the character.
     */
    renderBackgroundLayer() {
        const w = this.world;

        this.ctx.translate(w.camera_x, 0);
        this.addObjectsToMap(w.level.backgroundObjects);
        this.addObjectsToMap(w.level.clouds);
        this.addObjectsToMap(w.bottles);
        this.addObjectsToMap(w.coins);
        this.ctx.translate(-w.camera_x, 0);
    }

    /**
     * Renders all UI elements such as status bars and the mute button.
     * These elements do not move with the camera.
     */
    renderUILayer() {
        const w = this.world;

        this.addToMap(w.bottleStatusBar);
        this.addToMap(w.coinStatusBar);
        this.addToMap(w.statusbar);

        if (w.bossHpBarVisible) {
            this.addToMap(w.bossHpBar);
        }

        w.muteButton.draw();
    }

    /**
     * Renders all foreground elements including the character,
     * enemies, and throwable objects that move with the camera.
     */
    renderForegroundLayer() {
        const w = this.world;

        this.ctx.translate(w.camera_x, 0);
        this.addToMap(w.character);
        this.addObjectsToMap(w.level.enemies);
        this.addObjectsToMap(w.throwableObjects);
        this.ctx.translate(-w.camera_x, 0);
    }


    /**
     * Renders mobile touch controls when running on a touch-enabled device.
     */
    renderMobileControls() {
        const w = this.world;

        if ("ontouchstart" in window) {
            w.mobileControls.draw(this.ctx);
        }
    }


        /**
     * Draws an array of drawable game objects onto the canvas.
     * Each object is passed to addToMap() for proper rendering and flipping.
     * @param {Object[]} objects - Array of drawable game objects.
     */

        addObjectsToMap(objects) {
            objects.forEach(o => this.addToMap(o));
        }

        /**
     * Draws a single game object onto the canvas.
     * Automatically flips the object horizontally if needed.
     * @param {Object} obj - The drawable game object.
     */

        addToMap(obj) {
            if (obj.otherDirection) this.flipImage(obj);
            obj.draw(this.ctx);
            if (obj.otherDirection) this.flipImageBack(obj);
        }

        /**
     * Flips the rendering context horizontally for objects facing the opposite direction.
     * Temporarily inverts the object's x-position to match the flipped coordinate system.
     * @param {Object} obj - The object to flip before drawing.
     */

        flipImage(obj) {
            this.ctx.save();
            this.ctx.translate(obj.width, 0);
            this.ctx.scale(-1, 1);
            obj.x *= -1;
        }
        
        /**
     * Restores the object's original x-position and resets the canvas transform
     * after a horizontal flip has been applied.
     * @param {Object} obj - The object previously flipped.
     */

        flipImageBack(obj) {
            obj.x *= -1;
            this.ctx.restore();
        }
    }
