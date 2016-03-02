var XHR = require('./XHR');
var Tileset = require('./Tileset');

var Map = function (nom) {
    this.TAILLE_CASE_EN_PX = 32; // valeur d'un coté d'une case en px

    // Création de l'objet XmlHttpRequest
    var xhr = new XHR();

    // Chargement du fichier map/nom.json
    xhr.open("GET", './maps/' + nom + '.json', false);
    xhr.send(null);

    if (xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
        throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + xhr.status + ").");

    var mapJsonData = xhr.responseText;

    // Analyse des données
    var mapData = JSON.parse(mapJsonData);

    this.tileset = new Tileset(mapData.tileset);
    this.terrain = mapData.terrain;

    // Liste des personnages présents sur le terrain.
    this.personnages = new Array();
};

// Pour récupérer la taille (en tiles) de la carte
Map.prototype.getHauteur = function () {
    return this.terrain.length;
};

Map.prototype.getLargeur = function () {
    return this.terrain[0].length;
};

Map.prototype.dessinerMap = function (context) {
    for (var i = 0, l = this.terrain.length; i < l; i++) {
        var ligne = this.terrain[i];
        var y = i * this.TAILLE_CASE_EN_PX;

        for (var j = 0, k = ligne.length; j < k; j++) {
            this.tileset.dessinerTile(ligne[j], context, j * this.TAILLE_CASE_EN_PX, y);
        }
    }

    // Dessin des personnages
    for (var i = 0, l = this.personnages.length; i < l; i++) {
        this.personnages[i].dessinerPersonnage(context);
    }
};

Map.prototype.dessinerMapBoucleAuto = function (context, milisecondes) {
    var self = this;
    setInterval(function () {
        self.dessinerMap(context);
    }, milisecondes);
};

Map.prototype.isObstacle = function (coord) {
    /* conditions de délimitation à la map */
    if (coord.x < 0) {
        return true;
    }
    if (coord.y < 0) {
        return true;
    }
    if (coord.x >= (this.getLargeur() - 1) * this.TAILLE_CASE_EN_PX) {
        return true;
    }
    var tailleSprite = 48;
    if (coord.y >= ((this.getHauteur() - (1 + (tailleSprite - this.TAILLE_CASE_EN_PX)/this.TAILLE_CASE_EN_PX)) * this.TAILLE_CASE_EN_PX)) {
        return true;
    }

    return false;
};

/**
 * Ajouter un personnage à la map 
 * @param {Personnage} perso
 */
Map.prototype.addPersonnage = function (perso) {
    this.personnages.push(perso);
};

module.exports = Map;
