class DrawableObject {
    img;
    imageChache = {};
    currentImage = 0;
    x = 120;
    y = 270;
    height = 150;
    width = 150;


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
        return this.img
        
    }

    draw(ctx){
        if (this.isDead == true) {
            ctx.drawImage(this.imageDead, this.x, this.y, this.width, this.height);
        } 
        else{
        ctx.drawImage(this.img, this.x, this.y, this.width , this.height)}
    }

    drawFrame(ctx){
        if(this instanceof Character || this instanceof chicken ){
        ctx.beginPath();
        ctx.lineWidth= '5';
        ctx.strokestyle = 'blue';
        ctx.rect(this.x, this.y, this.width , this.height)
        ctx.stroke();}
    }


    loadImages(arr) {
        arr.forEach(path => {

            let img = new Image();
            img.src = path;
            this.imageChache[path] = img;
        });
    }



}