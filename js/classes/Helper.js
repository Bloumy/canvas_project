function Helper(){ return this; };

/**
 * 
 * @param {type} angle
 * @param {type} nbPx
 * 
 * @returns {x,y}
 */
Helper.prototype.getCoordonnees = function (x,y, angle, nbPx) {

    var coord = {'x': null, 'y': null};
    coord.x = Math.round(x + nbPx * Math.cos((angle) * (2.0 * Math.PI) / 360.0));
    coord.y = Math.round(y + nbPx * Math.sin((angle) * (2.0 * Math.PI) / 360.0));

    return coord;
};

module.exports = Helper;
