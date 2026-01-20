class RenderingManager {
    constructor(world) {
        this.world = world;
        this.canvas = world.canvas;
        this.ctx = world.ctx;
    }

    draw() {
        const w = this.world;
        if (w.victoryShown || w.gameOverShown) return;

        const scaleX = this.canvas.width / 720;
        const scaleY = this.canvas.height / 480;

        this.ctx.save();
        this.ctx.scale(scaleX, scaleY);
        this.ctx.clearRect(0, 0, 720, 480);

        // Background layer
        this.ctx.translate(w.camera_x, 0);
        this.addObjectsToMap(w.level.backgroundObjects);
        this.addObjectsToMap(w.level.clouds);
        this.addObjectsToMap(w.bottles);
        this.addObjectsToMap(w.coins);
        this.ctx.translate(-w.camera_x, 0);

        // UI layer
        this.addToMap(w.bottleStatusBar);
        this.addToMap(w.coinStatusBar);
        this.addToMap(w.statusbar);
        if (w.bossHpBarVisible) this.addToMap(w.bossHpBar);

        w.muteButton.draw();

        // Foreground layer
        this.ctx.translate(w.camera_x, 0);
        this.addToMap(w.character);
        this.addObjectsToMap(w.level.enemies);
        this.addObjectsToMap(w.throwableObjects);
        this.ctx.translate(-w.camera_x, 0);

        // Mobile controls
        if ("ontouchstart" in window) {
            w.mobileControls.draw(this.ctx);
        }

        this.ctx.restore();

        if (w.isPaused) {
            w.pauseScreen.draw();
        }
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(obj) {
        if (obj.otherDirection) this.flipImage(obj);
        obj.draw(this.ctx);
        if (obj.otherDirection) this.flipImageBack(obj);
    }

    flipImage(obj) {
        this.ctx.save();
        this.ctx.translate(obj.width, 0);
        this.ctx.scale(-1, 1);
        obj.x *= -1;
    }

    flipImageBack(obj) {
        obj.x *= -1;
        this.ctx.restore();
    }
}
