class BottleStatusBar extends DrawableObject {
    IMAGES = [
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',   // 0 bottles
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',  // 20%
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',  // 40%
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',  // 60%
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',  // 80%
        'IMG/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png', // 100%
    ];

    percentage = 0;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;  // Set position on screen
        this.y = 80;  // Position below the health bar
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);  // Initialize at 0
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageChache[path];
    }

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
