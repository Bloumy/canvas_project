
function HitBox(owner) {
    this.owner = owner; // objet, personnage, etc.
    this.positionnerHitBox();
    
}
;

HitBox.prototype.positionnerHitBox = function () {
    this.hitBoxRayon = (this.owner.largeur + this.owner.hauteur) / 4;
    this.hitBoxCenterX = this.owner.xPixel + this.owner.largeur/2;
    this.hitBoxCenterY = this.owner.xPixel + this.owner.hauteur/2;
}

HitBox.prototype.drawHitBox = function (context) {
    this.positionnerHitBox()
    
    context.beginPath();
    context.arc(this.hitBoxCenterX, this.hitBoxCenterY, this.hitBoxRayon, 0,Math.PI * 2, true);
    context.stroke();
};


module.exports = HitBox;

