class Level {
    backgroundObjects;
    clouds; 
    enemies;
    level_end_x = 2200;

    constructor(enemies , clouds , backgroundObjects){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }

}