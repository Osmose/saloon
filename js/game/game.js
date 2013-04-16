define(function(require) {
    var Engine = require('flux/engine');
    var Entity = require('flux/entity');
    var Graphic = require('flux/graphics/graphic');
    var TiledGraphic = require('flux/graphics/tiled');
    var Tilemap = require('flux/tilemap');

    var loader = require('game/loader');
    var SaloonWorld = require('game/world');

    // REGISTER RESOURCES TO LOAD HERE
    loader.register('firefox', 'img/firefox.png', 'image');
    loader.register('tiles_bar', 'img/tiles.png', 'image');
    loader.register('map_bar', 'maps/bar.tmx', 'map');

    // Callback run once all resources have been loaded.
    loader.loadAll().done(function() {
        // Initialize engine.
        var engine = new Engine(256, 224, 3, new SaloonWorld());
        engine.bg_color = '#000000';

        // ADD INITIAL STATE (entities, worlds, etc) HERE
        function Player(x, y) {
            Entity.call(this, x, y);
            this.graphic = new Graphic(loader.get('firefox'));
        }
        Player.prototype = Object.create(Entity.prototype);
        engine.addEntity(new Player(10, 10));

        // Create map.
        var map = loader.get('map_bar');
        var tilemap = new Tilemap(map.layers['tiles'].grid, 0, 0);

        // Create tuled graphic for rendering tilemap.
        tilemap.graphic = new TiledGraphic(loader.get('tiles_bar'), 16, 16, 0, 0);
        engine.world.tilemap = tilemap;

        // Append canvas to screen and start the engine!
        document.querySelector('#game').appendChild(engine.canvas);
        engine.start();
    });
});
