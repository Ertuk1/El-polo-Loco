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

    constructor(boss) {
        super();
        this.boss = boss;
        this.loadImages(this.IMAGES);
        this.x = 500;  // Set position on screen
        this.y = 5;  // Position below the health bar
        this.width = 200;
        this.height = 60;
        this.update();
        this.setPercentage(100); 
    }

    
    setBoss(boss) {
        this.boss = boss; // Assign the Endboss
        this.update(); // Immediately update the status bar
    }


    update() {
        if (this.boss) {
            // Decrease the percentage by 20 for each update
            this.percentage -= 20;
    
            // Ensure the percentage doesn't go below 0
            if (this.percentage < 0) {
                this.percentage = 0;
            }
            
            this.setPercentage(this.percentage); // Update status bar
        }
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageChache[path];
    }

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
