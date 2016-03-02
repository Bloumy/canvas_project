uglifyjs node_modules/excanvas/excanvas.compiled.js -o js/excanvas.compiled.js 

browserify js/rpg.js | uglifyjs > js/rpg.min.js 
 