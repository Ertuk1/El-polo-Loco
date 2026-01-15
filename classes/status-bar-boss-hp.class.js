/**
 * BossStatusbar class displaying the endboss's health bar.
 * Shows health percentage with visual bar that depletes as boss takes damage.
 * @extends DrawableObject
 */
class BossStatusbar extends DrawableObject {
    IMAGES = [
        'IMG/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'IMG/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'IMG/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'IMG/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'IMG/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'IMG/7_statusbars/2_statusbar_endboss/orange/orange100.png',
    ];
    percentage = 100;
    boss;
    
    /**
     * Initializes the boss status bar with reference to the boss enemy.
     * @param {Endboss} boss - The endboss enemy to track health for.
     */
    constructor(boss) {
        super();
        this.boss = boss;
        this.loadImages(this.IMAGES);
        this.x = 500;
        this.y = 5;
        this.width = 200;
        this.height = 60;
        this.update();
        this.setPercentage(100); 
    }
    
    /**
     * Sets or updates the boss reference for this status bar.
     * @param {Endboss} boss - The endboss enemy to track.
     */
    setBoss(boss) {
        this.boss = boss;
        this.update();
    }
    
    /**
     * Updates the status bar by decreasing health percentage by 20.
     */
    update() {
        if (this.boss) {
            this.percentage -= 20;
    
            if (this.percentage < 0) {
                this.percentage = 0;
            }
            
            this.setPercentage(this.percentage);
        }
    }
    
    /**
     * Sets the health percentage and updates the displayed image.
     * @param {number} percentage - The health percentage (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageChache[path];
    }
    
    /**
     * Determines which image index to use based on current health percentage.
     * @returns {number} Image index (0-5) corresponding to health level.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}