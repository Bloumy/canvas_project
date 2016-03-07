var Directions = require('./Directions');

/**
 * 
 * @param {string} url chemin complet du sprite png
 * @param {int} x coordonnées
 * @param {int} y
 * @param {int} angle
 * 
 * @returns {Personnage}
 */
function Personnage(url, x, y, angle) {

    this.FRAME_PAR_CASE = 1; // on change de frame tout les 8px de deplacement

    this.NB_PX_DEPLACEMENT = 4; // distance d'un déplacement en pixels 

    this.CASES_PAR_SECONDE = 4;

    this.DEFAULT_VITESSE = (this.CASES_PAR_SECONDE / this.NB_PX_DEPLACEMENT) * 32; // vitesse en pixels par secondes;

    var d = new Directions();
    this.DIRECTIONS = d.DIRECTION;


    this.map = null;
    this.vitesse = this.DEFAULT_VITESSE; // modifié par des sorts
    this.xPixel = x * 32; // (en pixels)
    this.yPixel = y * 32; // (en pixels)
    this.direction = this.getDirectionByAngle(angle);
    this.angle = angle;

    // Chargement de l'image dans l'attribut image
    this.image = new Image();
    this.image.referenceDuPerso = this;
    this.image.src = "sprites/" + url;
    this.largeur = this.image.width / 4;
    this.hauteur = this.image.height / 4;
    this.hitBoxRayon = (this.largeur + this.hauteur) / 4;

    this.frame = 0;
    this.interval = null;
    this.zindex = 0;
    
    this.isChargingAttaque = false;
    
    return this;
}
;



Personnage.prototype.dessinerPersonnage = function (context) {


    //dessiner l'arme avant si personnage au dessus
    if (this.arme && this.arme.zindex < this.zindex) {
        this.arme.positionnerArmeOnChar();
        this.arme.dessinerArme(context);
    }

    context.drawImage(
            this.image,
            this.largeur * this.frame, this.getFrame() * this.hauteur, // Point d'origine du rectangle source à prendre dans notre image
            this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du personnage)
            this.xPixel, this.yPixel, // Point de destination
            this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
            );

    //dessiner l'arme apres si personnage au dessous
    if (this.arme && this.arme.zindex >= this.zindex) {
        this.arme.positionnerArmeOnChar();
        this.arme.dessinerArme(context);
    }
};

Personnage.prototype.getCoordonneesAdjacentes = function (angle, nbPx) {

    if (nbPx === undefined || nbPx === null) {
        nbPx = this.NB_PX_DEPLACEMENT;
    }

    var coord = {'x': null, 'y': null};
    coord.x = Math.round(this.xPixel + nbPx * Math.cos((angle) * (2.0 * Math.PI) / 360.0));
    coord.y = Math.round(this.yPixel + nbPx * Math.sin((angle) * (2.0 * Math.PI) / 360.0));

    return coord;
};



Personnage.prototype.deplacerEnPx = function (angle, map, nbPx) {
    this.angle = angle;
    this.direction = this.getDirectionByAngle(angle);

    // On vérifie que la case demandée est bien située dans la carte
    var coordDestination = this.getCoordonneesAdjacentes(angle, nbPx);

    // s'il y a un obstacle on n'effectue pas le déplacement

    if (!this.canGoTo(map, coordDestination)) {
        return false;
    }

    // on update les coordonnées de la position du personnage
    this.xPixel = coordDestination.x;
    this.yPixel = coordDestination.y;

    return true;
};

Personnage.prototype.getDirectionByAngle = function (angle) {
    if (45 <= angle && angle <= 135) {
        return this.DIRECTIONS.BAS;
    }

    // regarde à droite
    if ((0 <= angle && angle < 45) || (315 < angle && angle <= 360)) {
        return this.DIRECTIONS.DROITE;
    }

    // regarde en bas
    if (225 <= angle && angle <= 315) {
        return this.DIRECTIONS.HAUT;
    }

    // regarde à gauche
    if (135 < angle && angle < 225) {
        return this.DIRECTIONS.GAUCHE;
    }
};

Personnage.prototype.doNothing = function () {
    clearInterval(this.interval);
    this.frame = 0;
};

Personnage.prototype.deplacer = function (angle, map, nbPx) {
    clearInterval(this.interval);
    this.frame = 0;


    if (nbPx === undefined || nbPx === null) {

        /**
         * vitesse = distance / temps 
         */
        var d = map.TAILLE_CASE_EN_PX; // en px
        var v = this.vitesse; // en pixel/seconde
        v = v * 32; //  en case/seconde
        var t = d / v; // en seconde

        var millisecondes = t * 1000;
        var nbPx = this.NB_PX_DEPLACEMENT;
        var distance_pour_une_frame = map.TAILLE_CASE_EN_PX / this.FRAME_PAR_CASE;

        var self = this;
        this.deplacerEnPx(angle, map, nbPx);
        this.frame++;
        var pxParcourus = 0;
        this.interval = setInterval(function () {

            self.deplacerEnPx(angle, map, nbPx);
            if (pxParcourus >= distance_pour_une_frame) {
                self.frame++;
                pxParcourus = 0;
            }
            if (self.frame > 3) {
                self.frame %= 4;
            }
            pxParcourus += nbPx;
        }, millisecondes);
    } else {
        this.deplacerEnPx(angle, map, nbPx);
    }
};


Personnage.prototype.canGoTo = function (map, coord) {
    /* conditions de délimitation à la map */
    if (coord.x < 0) {
        return false;
    }
    if (coord.y < 0) {
        return false;
    }
    if (coord.x >= (map.getLargeur() - 1) * map.TAILLE_CASE_EN_PX) {
        return false;
    }
    if (coord.y >= ((map.getHauteur() - (1 + (this.hauteur - map.TAILLE_CASE_EN_PX) / map.TAILLE_CASE_EN_PX)) * map.TAILLE_CASE_EN_PX)) {
        return false;
    }
    if (map.isObstacle(coord)) {
        return false;
    }

    return true;
};

Personnage.prototype.equiperArme = function (arme) {
    this.arme = arme;
    this.arme.equipedBy = this;
    this.arme.equipeToChar(this);
    this.positionnerArme();
};

Personnage.prototype.positionnerArme = function () {
    if (!this.arme) {
        return;
    }

    this.arme.positionnerArmeOnChar();
};

Personnage.prototype.chargerAttaque = function () {
    if (!this.arme) {
        return false;
    }
    
    this.arme.chargerAttaque();
    this.isChargingAttaque = true;
    return true;
};

Personnage.prototype.attaquer = function () {
    if (!this.arme) {
        return false;
    }
    
    this.arme.attaquer();
    this.isChargingAttaque = false;
    return true;
};

Personnage.prototype.annulerAttaque = function () {
    if (!this.arme) {
        return false;
    }
    this.arme.annulerAttaque();
    return true;
};

/* renvoie la ligne de l'image pour recupérer celle correspon,dant à sa direction */
Personnage.prototype.getFrame = function () {
    switch (this.direction) {
        
        case this.DIRECTIONS.DROITE :
            return 2;
            break;
            
        case this.DIRECTIONS.BAS :
            return 0;
            break;
            
        case this.DIRECTIONS.GAUCHE :
            return 1;
            break;
            
        case this.DIRECTIONS.HAUT :
            return 3;
            break;
            
    }
    return 0;
};

module.exports = Personnage;