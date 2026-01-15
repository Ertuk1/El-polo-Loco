/**
 * BottleStatusBar class displaying the collected bottles count.
 * Shows percentage of bottles collected with visual bar.
 * @extends DrawableObject
 */
class BottleStatusBar extends DrawableObject {
    IMAGES = [
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',
    ];
    percentage = 0;
    
    /**
     * Initializes the bottle status bar at starting position.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 80;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }
    
    /**
     * Sets the bottle collection percentage and updates the displayed image.
     * @param {number} percentage - The collection percentage (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageChache[path];
    }
    
    /**
     * Determines which image index to use based on current collection percentage.
     * @returns {number} Image index (0-5) corresponding to collection level.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}