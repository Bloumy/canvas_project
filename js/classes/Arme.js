function Arme(name, url, spriteX, spriteY, tx, ty, angle) {
    this.name = name;

    this.image = new Image();
    this.image.referenceDeLArme = this;
    this.image.src = "sprites/" + url;
    this.largeur = this.image.width / 14;
    this.hauteur = this.image.height / 30;

    //choix de l'image dans la grille d'image
    this.spriteX = spriteX;
    this.spriteY = spriteY;

    // positionnement de l'image dans la source
    this.angle = 0;
    this.translationX = 0;
    this.translationY = 0;
    if (angle !== undefined || angle !== null) {
        this.angle = angle;
    }

    if (tx !== undefined || tx !== null) {
        this.translationX = tx;
    }

    if (ty !== undefined || ty !== null) {
        this.translationY = ty;
    }

    // emplacement sur la map
    this.xPixel = 0;
    this.yPixel = 0;


}

Arme.prototype.equipeToChar = function (char) {
    char.equiperArme(this);
    this.equipedBy = char;
};


Arme.prototype.getName = function () {
    return this.name;
};


Arme.prototype.dessinerArme = function (context) {

    // save the current co-ordinate system 
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(this.equipedBy.xPixel + this.translationX, this.equipedBy.yPixel + this.translationY);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    context.rotate(this.angle * Math.PI / 180);
    context.translate(this.equipedBy.xPixel, this.equipedBy.yPixel);
    context.drawImage(
            this.image,
            this.largeur * this.spriteX, this.hauteur * this.spriteY, // Point d'origine du rectangle source à prendre dans notre image
            this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille de l'arme)
            -this.equipedBy.xPixel, -this.equipedBy.yPixel, // Point de destination
            this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
            );

    // and restore the co-ords to how they were when we began
    context.restore();
};

Arme.prototype.drawRotatedImage = function (context, image, x, y, angle) {

    // save the current co-ordinate system 
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    context.rotate(angle * Math.PI / 180);

    // draw it up and to the left by half the width
    // and height of the image 
    context.drawImage(
            image,
            -(this.image.width / 2), -(this.image.height / 2));

    // and restore the co-ords to how they were when we began
    context.restore();
};


module.exports = Arme;

