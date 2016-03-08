var HitBox = require('./HitBox');

Arme.prototype.TYPE = {
    CUSTOM: 'custom',
    SWORD: 'epee'
};

function Arme(name, url, spriteX, spriteY, tx, ty, angle) {

    if (tx !== undefined || tx !== null) {
        tx = 0;
    }
    if (ty !== undefined || ty !== null) {
        ty = 0;
    }
    if (angle !== undefined || angle !== null) {
        angle = 0;
    }

    // nom de l'arme crée (nom unique)
    this.name = name;

    // image assignée à l'arme
    this.image = new Image();
    this.image.referenceDeLArme = this;
    this.image.src = "sprites/" + url;
    this.largeur = this.image.width / 14; // divisé par le nombre d'icone sur une ligne
    this.hauteur = this.image.height / 30; // divisé par le nombre d'icone sur une colone

    // choix de l'image dans la grille d'image
    this.spriteX = spriteX;
    this.spriteY = spriteY;

    // positionnement
    this.angle = angle;
    this.xPixel = tx;
    this.yPixel = ty;
    this.tx = tx;
    this.ty = ty;

    // passe à true quand on effectue l'action "attaque"
    this.animationAttaque = false;
    // temps de l'action "attaque"
    this.attaqueDuration = 200; // millisecondes
    // maintient le timeOut pour le supprimer quand necessaire
    this.attaqueTimeOutHolder = null;

    this.timeCurrentChargement = null;
    this.chargementAttaqueDuration = 1000;  // millisecondes
    this.chargementAttaqueTimeOutHolder = null;

    // type de l'arme, par defaut, custom
    this.type = this.TYPE.CUSTOM;

    // stats de l'arme
    this.degats = 10;
    this.poid = 1; // influe sur la vitesse d'attaque

    // pour la hitbox
    this.portee = 32;
    this.angleAttaque = 45; // degres
    this.direction = 0;

    // rattachement d'une hitbox

    this.hitBox = new HitBox(this);

}
;

Arme.prototype.equipeToChar = function (char) {
    this.equipedBy = char;
    char.arme = this;
};


Arme.prototype.getName = function () {
    return this.name;
};


Arme.prototype.dessinerArme = function (context) {

    // save the current co-ordinate system 
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(this.xPixel + this.tx, this.yPixel + this.ty);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    context.rotate(this.angle * Math.PI / 180);
    context.translate(-(this.xPixel + this.tx), -(this.yPixel + this.ty));
//    return;
    context.drawImage(
            this.image,
            this.largeur * this.spriteX, this.hauteur * this.spriteY, // Point d'origine du rectangle source à prendre dans notre image
            this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille de l'arme)
            this.xPixel + this.tx, this.yPixel + this.ty, // Point de destination
            this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
            );

    // and restore the co-ords to how they were when we began
    context.restore();

};


Arme.prototype.positionnerHitBox = function () {
    return this.type;
};

Arme.prototype.getType = function () {
    return this.type;
};

Arme.prototype.positionnerArmeOnChar = function () {
    this.xPixel = this.equipedBy.xPixel;
    this.yPixel = this.equipedBy.yPixel;

    if (!this.equipedBy) {
        return;
    }

    var nbFrameAttaque = this.attaqueDuration / this.equipedBy.map.refreshInterval;
    var nbFrameChargementAttaque = this.chargementAttaqueDuration / this.equipedBy.map.refreshInterval;

    var translationX = 0;
    var translationY = 0;
    var angle = 0;
    var zindex = this.equipedBy.zindex;

    //pour passer la frame de l'arme sous celle du char

    switch (this.getType()) {
        case this.type = this.TYPE.EPEE:
            if (this.equipedBy.direction === this.equipedBy.DIRECTIONS.DROITE) {
                if (this.animationAttaque) {

//                    translationX += 44;
//                    translationY += this.ty + 30 / nbFrameAttaque;
//                    translationY += 30;
//                    angle += 60;
//                    angle += this.angle + 60 / nbFrameAttaque;


                    translationX += 50;
                    translationY += 40;
                    angle += 150;
                    zindex += 10;
                } else if (this.isChargingAttaque) {
                    translationX += 14;
//                    translationX += this.tx - 59 / nbFrameChargementAttaque;;
                    translationY += -8;
//                    translationY += this.ty - 10 / nbFrameChargementAttaque;
                    angle += 40;
//                    angle += this.angle - 90 / nbFrameChargementAttaque;
                    zindex += 10;
                } else {
                    translationX += 44;
                    translationY += 4;
                    angle += 90;
                    zindex += 10;
                }
            }

            if (this.equipedBy.direction === this.equipedBy.DIRECTIONS.GAUCHE) {
                translationX -= 13;
                translationY += 4;
                angle += 0;
                zindex -= 10;
            }

            if (this.equipedBy.direction === this.equipedBy.DIRECTIONS.HAUT) {
                translationX += 20;
                translationY -= 6;
                angle += 45;
                zindex -= 10;
            }

            if (this.equipedBy.direction === this.equipedBy.DIRECTIONS.BAS) {
                translationX += 14;
                translationY -= 6;
                angle += 45;
                zindex += 10;
            }

            break;
        default:
            ;

    }
    ;

    this.tx = translationX;
    this.ty = translationY;
    this.angle = angle;
    this.zindex = zindex;
};

Arme.prototype.chargerAttaque = function () {
    var self = this;

    this.timeCurrentChargement = Date.now(); // millisecondes
    this.isChargingAttaque = true;

    this.chargementAttaqueTimeOutHolder = setTimeout(function () {
        this.timeCurrentChargement = null;
        self.attaquer();
    }, this.chargementAttaqueDuration);
};

Arme.prototype.attaquer = function () {
    if (!this.isChargingAttaque) {
        return;
    }

    clearTimeout(this.chargementAttaqueTimeOutHolder);
    this.isChargingAttaque = false;
    this.animationAttaque = true;

    var self = this;
    this.attaqueTimeOutHolder = setTimeout(function () {
        self.animationAttaque = false;
        self.isChargingAttaque = false;
    }, this.attaqueDuration);

    var cibles = this.getTargetsInRange();
    var degats = 0;
    for (var cible in cibles) {
        degats = this.calculateDamage(cible);
        cible.vie -= degats;
    }
};

Arme.prototype.annulerAttaque = function () {
    if (!this.animationAttaque) {
        return;
    }
    clearTimeout(this.attaqueHolder);
    this.animationAttaque = false;
};


Arme.prototype.getTargetsInRange = function () {
    var targets = [];
    return targets;
};

Arme.prototype.calculateDamage = function (cible) {
    return this.degats;
};

//
//Arme.prototype.getHitBoxCenterCoord = function () {
//    return {
//        x: this.xPixel + this.largeur / 2,
//        y: this.yPixel + this.hauteur / 2
//    };
//};


module.exports = Arme;

