var Directions = require('./classes/Directions');
var Map = require('./classes/Map');
var Personnage = require('./classes/Personnage');
var Controles = require('./classes/Controles');
var Armes = require('./classes/Armes');


////appeler une tileset
//var ts = new Tileset("basique.png");



window.onload = function () {

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

//appeler une map
    var map = new Map("floor1");
    var directions = new Directions();
    var controles = new Controles(map, canvas);
    var hero = new Personnage("hero.png", 1, 1, directions.DIRECTION.HAUT);
//var epee = new Arme("Epee", "icones.png", 0, 5, 0, 0, 0);
    var armes = new Armes();
    var epee = armes.createEpee('ExcaliBurne');


    //Definir la taile de la carte
    canvas.width = map.getLargeur() * 32;
    canvas.height = map.getHauteur() * 32;

    //Ajouter le personnage
    map.addPersonnage(hero);

    //Définir les controles du personnage
    controles.assignKeybordToChar(hero);

    //Assigner une arme au personnage
    hero.equiperArme(epee);
    console.log(epee);


    //Dessiner une carte
//    map.dessinerMap(ctx);
    map.dessinerMapBoucleAuto(ctx, 40);

//    document.addEventListener("activatemousebutton", function (e) {
//        console.log(e);
//    });
////    
//    document.addEventListener("deactivatemousebutton", function (e) {
//        console.log(e);
//    });
////
////
////
////
////
//    document.addEventListener("activatemousescroll", function (e) {
//        console.log(e);
//    }); 
//
//    document.addEventListener("mousemovewhileclick", function (e) {
//        console.log(e);
//    }); 
};






