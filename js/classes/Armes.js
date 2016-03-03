var Arme = require('./Arme');

function Armes() {
    this.ARME_TYPE = {};
    this.ARME_TYPE.EPEE = 'epee';

    this.armes = [];

    return this;
}

Armes.prototype.getArmes = function () {
    return this.armes;
};

Armes.prototype.createArme = function (type, name, url, imgXSource, imgYSource, decalageXDest, decalageYDest, angle) {

    if (type + '_' + name in this.armes) {
        return false;
    }

    var arme = new Arme(name, url, imgXSource, imgYSource, decalageXDest, decalageYDest, angle);
    arme.type = type;
    this.armes[type + '_' + name] = arme;
    return arme;
};

Armes.prototype.getArme = function (type, name) {
    if (type + '_' + name in this.armes) {
        return this.arme[type + '_' + name];
    }
    return null;
};

Armes.prototype.removeArme = function (type, name) {
    if (type + '_' + name in this.armes) {
        this.armes.splice(type + '_' + name, 1);
    }
    return null;
};



Armes.prototype.createEpee = function (name) {
    return this.createArme(this.ARME_TYPE.EPEE, name, "icones.png", 0, 5, 0, 0, 0);
};

Armes.prototype.getEpee = function (name) {
    return this.getArme(this.ARME_TYPE.EPEE, name);
};

Armes.prototype.removeEpee = function (name) {
    return this.removeArme(this.ARME_TYPE.EPEE, name);
};




module.exports = Armes;

