class CoinStatusBar extends DrawableObject {

    IMAGES = [
        'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'IMG/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
    ];

    percentage = 0;  // Initial percentage for coins collected

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 40;  // Different y position to distinguish it from the health bar
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);  // Start with 0 coins
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
