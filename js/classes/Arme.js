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
    this.zindex = 0;

    // passe à true quand on effectue l'action "attaque"
    this.animationAttaque = false;
    // temps de l'action "attaque"
    this.attaqueDuration = 200; // millisecondes
    // maintient le timeOut pour le supprimer quand necessaire
    this.attaqueTimeOutHolder = null;

    this.timeCurrentChargement = null;
    this.chargementAttaqueDuration = 1000;  // millisecondes
    this.chargementAttaqueTimeOutHolder = null;
    this.pourcentageChargeAttaque = 0;
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
    this.zindex = char.zindex;
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


    if (!this.equipedBy) {
        return;
    }
    if (this.isChargingAttaque) {
        this.pourcentageChargeAttaque = (Date.now() - this.timeCurrentChargement) * 100 / this.chargementAttaqueDuration;
    }

    this.xPixel = this.equipedBy.xPixel;
    this.yPixel = this.equipedBy.yPixel;


//    var nbFrameAttaque = this.attaqueDuration / this.equipedBy.map.refreshInterval;
//    var nbFrameChargementAttaque = this.chargementAttaqueDuration / this.equipedBy.map.refreshInterval;

    var zindex = this.equipedBy.zindex;    //pour passer la frame de l'arme sous celle du char

    switch (this.getType()) {
        case this.type = this.TYPE.EPEE:

            if (this.equipedBy.direction === this.equipedBy.DIRECTIONS.DROITE) {
                var txStart = 44;
                var txEnd = 14;

                var tyStart = 4;
                var tyEnd = -8;

                var angleStart = 90;
                var angleEnd = 40;

                if (this.animationAttaque) {
                    this.tx = 50;
                    this.ty = 40;
                    this.angle = 150;
                    this.zindex = zindex + 10;

                } else if (this.isChargingAttaque) {
                    this.tx = txEnd + ((txStart - txEnd) - (txStart - txEnd) * this.pourcentageChargeAttaque / 100); // passer de 44 à 14
                    this.ty = tyEnd + ((tyStart - tyEnd) - (tyStart - tyEnd) * this.pourcentageChargeAttaque / 100); // passer de 44 à 14
                    this.angle = angleEnd + ((angleStart - angleEnd) - (angleStart - angleEnd) * this.pourcentageChargeAttaque / 100);
                    this.zindex = zindex + 10;

                } else {
                    this.tx = txStart;
                    this.ty = tyStart;
                    this.angle = angleStart;
                    this.zindex = zindex + 10;
                }
            }

            if (this.equipedBy.direction === this.equipedBy.DIRECTIONS.GAUCHE) {
                var txStart = -13;
                var txEnd = 17;

                var tyStart = 4;
                var tyEnd = -8;

                var angleStart = 0;
                var angleEnd = 50;

                if (this.animationAttaque) {
                    this.tx = -19;
                    this.ty = 36;
                    this.angle = -60;
                    this.zindex = zindex - 10;

                } else if (this.isChargingAttaque) {
                    this.tx = txEnd + ((txStart - txEnd) - (txStart - txEnd) * this.pourcentageChargeAttaque / 100); // passer de 44 à 14
                    this.ty = tyEnd + ((tyStart - tyEnd) - (tyStart - tyEnd) * this.pourcentageChargeAttaque / 100); // passer de 44 à 14
                    this.angle = angleEnd + ((angleStart - angleEnd) - (angleStart - angleEnd) * this.pourcentageChargeAttaque / 100);
                    this.zindex = zindex - 10;

                } else {
                    this.tx = txStart;
                    this.ty = tyStart;
                    this.angle = angleStart;
                    this.zindex = zindex - 10;
                }
            }

            if (this.equipedBy.direction === this.equipedBy.DIRECTIONS.HAUT) {
                var txStart = 20;
                var txEnd = 20;

                var tyStart = -6;
                var tyEnd = -20;

                var angleStart = 45;
                var angleEnd = 45;

                if (this.animationAttaque) {
                    this.tx = 20;
                    this.ty = 40;
                    this.angle = 225;
                    this.zindex = zindex - 10;

                } else if (this.isChargingAttaque) {
                    this.tx = txEnd + ((txStart - txEnd) - (txStart - txEnd) * this.pourcentageChargeAttaque / 100); // passer de 44 à 14
                    this.ty = tyEnd + ((tyStart - tyEnd) - (tyStart - tyEnd) * this.pourcentageChargeAttaque / 100); // passer de 44 à 14
                    this.angle = angleEnd + ((angleStart - angleEnd) - (angleStart - angleEnd) * this.pourcentageChargeAttaque / 100);
                    this.zindex = zindex - 10;

                } else {
                    this.tx = txStart;
                    this.ty = tyStart;
                    this.angle = angleStart;
                    this.zindex = zindex - 10;
                }
            }

            if (this.equipedBy.direction === this.equipedBy.DIRECTIONS.BAS) {
                var txStart = 12;
                var txEnd = 12;

                var tyStart = -6;
                var tyEnd = -20;

                var angleStart = 45;
                var angleEnd = 45;

                if (this.animationAttaque) {
                    this.tx = 12;
                    this.ty = 66;
                    this.angle = 225;
                    this.zindex = zindex + 10;

                } else if (this.isChargingAttaque) {
                    this.tx = txEnd + ((txStart - txEnd) - (txStart - txEnd) * this.pourcentageChargeAttaque / 100); // passer de 44 à 14
                    this.ty = tyEnd + ((tyStart - tyEnd) - (tyStart - tyEnd) * this.pourcentageChargeAttaque / 100); // passer de 44 à 14
                    this.angle = angleEnd + ((angleStart - angleEnd) - (angleStart - angleEnd) * this.pourcentageChargeAttaque / 100);
                    this.zindex = zindex + 10;

                } else {
                    this.tx = txStart;
                    this.ty = tyStart;
                    this.angle = angleStart;
                    this.zindex = zindex + 10;
                }
            }

            break;
        default:
            ;
    }
    ;
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
    this.pourcentageChargeAttaque = 0;
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

