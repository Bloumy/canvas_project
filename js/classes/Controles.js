var Key = require('./Key');
var Mouse = require('./Mouse');
var Directions = require('./Directions');
var Helper = require('./Helper');

function Controles(map, canvasDiv) {
    this.i = 0;
    this.map = map;
    this.canvasDiv = canvasDiv;
    this.directions = new Directions();
    this.initCommandeKey();
}
;

Controles.prototype.initCommandeKey = function () {

    var k = new Key(this.canvasDiv);
    var m = new Mouse(this.canvasDiv);
    this.mouse = m;
    this.keys = k;

//    var key = k.KEY;
//    this.DEFAULT_COMMANDE[this.direction.DIRECTION.HAUT] = [[key.up, key.A, key.a]];
//    this.DEFAULT_COMMANDE[this.direction.DIRECTION.HAUTDROITE] = [[key.up, key.A, key.a],[key.right, key.D, key.d]];
//    this.DEFAULT_COMMANDE[this.direction.DIRECTION.DROITE] = [[key.right, key.D, key.d]];
//    this.DEFAULT_COMMANDE[this.direction.DIRECTION.BASDROITE] = [[key.right, key.D, key.d],[key.down, key.S, key.s]];
//    this.DEFAULT_COMMANDE[this.direction.DIRECTION.BAS] = [[key.down, key.S, key.s]];
//    this.DEFAULT_COMMANDE[this.direction.DIRECTION.BASGAUCHE] = [[key.down, key.S, key.s],[key.left, key.Q, key.q]];
//    this.DEFAULT_COMMANDE[this.direction.DIRECTION.GAUCHE] = [[key.left, key.Q, key.q]];
//    this.DEFAULT_COMMANDE[this.direction.DIRECTION.HAUTGAUCHE] = [[key.left, key.Q, key.q],[key.up, key.A, key.a]];

};

Controles.prototype.assignKeybordToChar = function (char) {
    var self = this;
    document.addEventListener("activatekey", function (e) {
        self.activateCharCommande(char, e);
    });

    document.addEventListener("deactivatekey", function (e) {
        self.activateCharCommande(char, e);
    });

    document.addEventListener("activatemousebutton", function (e) {
        self.activateCharCommande(char, e);
    });

    document.addEventListener("deactivatemousebutton", function (e) {
        self.activateCharCommande(char, e);
    });

};


Controles.prototype.activateCharCommande = function (char, e) {

    if (e === undefined) {
        e = null;
    }
    var helper = new Helper();
    var keys = this.keys.getKeysActivated();
    var keysReverse = this.swap(keys);
    var key = this.keys.KEY;

    var mouseButtons = this.mouse.getButtonsActivated();
    var mouseButtonsReverse = this.swap(mouseButtons);
    var mouseButton = this.mouse.BUTTON;

    //commandes à la souris
    if (mouseButton.left in mouseButtonsReverse) {
        char.chargerAttaque();
    } else {
        if (char.isChargingAttaque) {
            char.attaquer();
        }
    }

    if (mouseButton.right in mouseButtonsReverse) {
        var angle = helper.getAngleBetweenTwoPoints(char.xPixel, char.yPixel, e.coordonates.x, e.coordonates.y);
        console.log(angle);
        char.deplacer(angle, this.map);
        return true;
    }

    //commandes à deux touches
    if (key.up in keysReverse && key.right in keysReverse) {
//        char.deplacer(45, this.map); // déplace le personnage en ligne droite jusqu'à ce que la commande ne soit plus active
        char.deplacer(315, this.map); // déplace le personnage en ligne droite jusqu'à ce que la commande ne soit plus active
        return true;
    }

    if (key.down in keysReverse && key.right in keysReverse) {
//        char.deplacer(315, this.map); // déplace le personnage en ligne droite jusqu'à ce que la commande ne soit plus active
        char.deplacer(45, this.map); // déplace le personnage en ligne droite jusqu'à ce que la commande ne soit plus active
        return true;
    }

    if (key.up in keysReverse && key.left in keysReverse) {
//        char.deplacer(135, this.map); // déplace le personnage en ligne droite jusqu'à ce que la commande ne soit plus active
        char.deplacer(225, this.map); // déplace le personnage en ligne droite jusqu'à ce que la commande ne soit plus active
        return true;
    }

    if (key.down in keysReverse && key.left in keysReverse) {
//        char.deplacer(225, this.map); // déplace le personnage en ligne droite jusqu'à ce que la commande ne soit plus active
        char.deplacer(135, this.map); // déplace le personnage en ligne droite jusqu'à ce que la commande ne soit plus active
        return true;
    }



    //commandes à une touche
    if (key.up in keysReverse) {
//        char.deplacer(90, this.map);
        char.deplacer(270, this.map);
        return true;
    }

    if (key.right in keysReverse) {
        char.deplacer(0, this.map);
        return true;
    }

    if (key.down in keysReverse) {
//        char.deplacer(270, this.map);
        char.deplacer(90, this.map);
        return true;
    }

    if (key.left in keysReverse) {
        char.deplacer(180, this.map);
        return true;
    }


    char.doNothing();
    return false;
};

Controles.prototype.swap = function (array) {
    var ret = {};
    for (var key in array) {
        ret[array[key]] = key;
    }
    return ret;
};

module.exports = Controles;