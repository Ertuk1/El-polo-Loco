/**
 * DrawableObject class representing any object that can be drawn on the canvas.
 * Base class for all visual game objects, handling image loading and rendering.
 */
class DrawableObject {
    img;
    imageChache = {};
    currentImage = 0;
    x = 120;
    y = 270;
    height = 150;
    width = 150;
    
    /**
     * Loads a single image from the specified path.
     * @param {string} path - The file path to the image.
     * @returns {Image} The loaded image object.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
        return this.img
    }
    
    /**
     * Draws the object on the canvas context.
     * Uses dead image if object is dead, otherwise uses current image.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx){
        if (this.isDead == true) {
            ctx.drawImage(this.imageDead, this.x, this.y, this.width, this.height);
        } 
        else{
        ctx.drawImage(this.img, this.x, this.y, this.width , this.height)}
    }
    
    /**
     * Draws a debug frame around the object for collision detection visualization.
     * Only draws for Character and chicken instances.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx){
        if(this instanceof Character || this instanceof chicken ){
        ctx.beginPath();
        ctx.lineWidth= '5';
        ctx.strokestyle = 'blue';
        ctx.rect(this.x, this.y, this.width , this.height)
        ctx.stroke();}
    }
    
    /**
     * Loads multiple images and stores them in the image cache.
     * @param {string[]} arr - Array of file paths to images.
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageChache[path] = img;
        });
    }
}