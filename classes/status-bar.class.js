class StatusBar extends DrawableObject {
    constructor({ images, x, y, width = 200, height = 60, startPercentage = 100, thresholds }) {
        super();

        this.IMAGES = images;
        this.thresholds = thresholds;
        this.percentage = startPercentage;

        this.loadImages(this.IMAGES);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.setPercentage(this.percentage);
    }

    
    /**
 * Updates the internal percentage value and refreshes the displayed image
 * based on the resolved threshold index.
 *
 * @param {number} percentage - A value between 0 and 100 representing the current fill level.
 */

    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageChache[path];
    }

/**
 * Determines the correct image index for the current percentage.
 * Iterates through the threshold list from highest to lowest and returns
 * the first index whose threshold is met or exceeded.
 *
 * @returns {number} The index of the image corresponding to the current percentage.
 */
    resolveImageIndex() {
        for (let i = this.thresholds.length - 1; i >= 0; i--) {
            if (this.percentage >= this.thresholds[i]) {
                return i;
            }
        }
        return 0;
    }
}
