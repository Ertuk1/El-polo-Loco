/**
 * StatusBar class displaying the player character's health bar.
 * Shows health percentage with visual bar that depletes as character takes damage.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    IMAGES = [
        'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
        'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
        'IMG/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png',
    ]
    percentage = 100;
    energy = this.percentage
    
    /**
     * Initializes the health status bar at starting position with full health.
     */
    constructor(){
        super();
        this.loadImages(this.IMAGES)
        this.x = 40;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100)
    }
    
    /**
     * Sets the health percentage and updates the displayed image.
     * @param {number} percentage - The health percentage (0-100).
     */
    setPercentage(percentage){
        this.percentage = percentage
        let path = this.IMAGES[this.resolveImageIndex()]
        this.img = this.imageChache[path];
    }
    
    /**
     * Determines which image index to use based on current health percentage.
     * @returns {number} Image index (0-5) corresponding to health level.
     */
    resolveImageIndex(){
        if(this.percentage == 100){
            return 5
        }
        else if (this.percentage > 80){
            return 4
        }
        else if (this.percentage > 60){
            return 3
        }
        else if (this.percentage > 40){
            return 2 
        }
        else if (this.percentage > 20){
            return 1 
        }
        else {
            return 0;
        }
    }
}