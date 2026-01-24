class BossStatusBar extends StatusBar {
    constructor(boss) {
        super({
            images: [
                'IMG/7_statusbars/2_statusbar_endboss/orange/orange0.png',
                'IMG/7_statusbars/2_statusbar_endboss/orange/orange20.png',
                'IMG/7_statusbars/2_statusbar_endboss/orange/orange40.png',
                'IMG/7_statusbars/2_statusbar_endboss/orange/orange60.png',
                'IMG/7_statusbars/2_statusbar_endboss/orange/orange80.png',
                'IMG/7_statusbars/2_statusbar_endboss/orange/orange100.png',
            ],
            x: 500,
            y: 5,
            startPercentage: 100,
            thresholds: [0, 20, 40, 60, 80, 100]
        });

        this.boss = boss;
    }


    /**
 * Synchronizes the status bar with the boss's current health value.
 * If no boss reference is assigned, the update is skipped.
 */

    update() {
        if (!this.boss) return;
        this.setPercentage(this.boss.hp);
    }
}
