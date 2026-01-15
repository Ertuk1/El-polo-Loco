/**
 * Level class representing a game level with enemies, clouds, and background objects.
 * Defines the level boundaries and contains all level elements.
 */
class Level {
    backgroundObjects;
    clouds; 
    enemies;
    level_end_x = 2200;
    
    /**
     * Initializes a level with its elements.
     * @param {Array} enemies - Array of enemy objects in the level.
     * @param {Array} clouds - Array of cloud objects for parallax background.
     * @param {Array} backgroundObjects - Array of background image objects.
     */
    constructor(enemies , clouds , backgroundObjects){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}