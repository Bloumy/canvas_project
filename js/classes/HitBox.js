var Helper = require('./Helper');


function HitBox(owner) {
    this.owner = owner; // objet, personnage, etc.
    this.positionnerHitBox();

}
;

HitBox.prototype.positionnerHitBox = function () {

    this.hitBoxRayon = this.owner.portee;
    this.hitBoxCenterX = this.owner.xPixel;
    this.hitBoxCenterY = this.owner.yPixel;
    this.angle = this.owner.angleAttaque;
    this.angleOffset = 0;

    //si l'arme (ou objet) est équipé par unpersonnage, on prend la direction du personnage 
    //et le point de depart de la hitbox est le centre du personnage equipé de l'arme
    if (this.owner && this.owner.equipedBy) {
        this.hitBoxCenterX = this.owner.equipedBy.xPixel + this.owner.equipedBy.largeur / 2;
        this.hitBoxCenterY = this.owner.equipedBy.yPixel + this.owner.equipedBy.hauteur / 2;
        this.angleOffset = this.owner.equipedBy.angle;
    }

};

HitBox.prototype.drawHitBox = function (context) {
    var helper = new Helper();
    this.positionnerHitBox();

    var startingAngle = -this.angle / 2 + this.angleOffset;
    var endingAngle = this.angle / 2 + this.angleOffset;
    
    //arc de cercle
    context.beginPath();
    context.arc(this.hitBoxCenterX, this.hitBoxCenterY, this.hitBoxRayon, this.degresToRadians(startingAngle), this.degresToRadians(endingAngle), false);
    context.stroke();
    
    //ligne1
    context.moveTo(this.hitBoxCenterX, this.hitBoxCenterY);
    context.lineTo(
            helper.getCoordonnees(this.hitBoxCenterX, this.hitBoxCenterY, startingAngle, this.hitBoxRayon).x,
            helper.getCoordonnees(this.hitBoxCenterX, this.hitBoxCenterY, startingAngle, this.hitBoxRayon).y
            );
    context.stroke();

    //ligne2
    context.moveTo(this.hitBoxCenterX, this.hitBoxCenterY);
    context.lineTo(
            helper.getCoordonnees(this.hitBoxCenterX, this.hitBoxCenterY, endingAngle, this.hitBoxRayon).x,
            helper.getCoordonnees(this.hitBoxCenterX, this.hitBoxCenterY, endingAngle, this.hitBoxRayon).y
            );
    context.stroke();

};

HitBox.prototype.degresToRadians = function (degres) {
    return degres * Math.PI / 180;
};

HitBox.prototype.RadiansToDegres = function (radians) {

    return radians * 180 / Math.PI;
};


module.exports = HitBox;

