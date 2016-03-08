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


Helper.prototype.getAngleBetweenTwoPoints = function (x,y,xPrime,yPrime) {
    var angle = 0;
    
    var cosAngle = (xPrime - x)/Math.sqrt(Math.pow(xPrime-x,2)+Math.pow(yPrime-y,2));
    console.log(xPrime - x);
    
    angle = cosAngle * 180/Math.PI;
//    var coord = {'x': null, 'y': null};
//    coord.x = Math.round(x + nbPx * Math.cos((angle) * (2.0 * Math.PI) / 360.0));
//    coord.y = Math.round(y + nbPx * Math.sin((angle) * (2.0 * Math.PI) / 360.0));
    
    

    return angle;
};



module.exports = Helper;
