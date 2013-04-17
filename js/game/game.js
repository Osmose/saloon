define(function(require) {
    var Engine = require('flux/engine');
    var Graphic = require('flux/graphics/graphic');
    var TiledGraphic = require('flux/graphics/tiled');
    var Tilemap = require('flux/tilemap');

    var loader = require('game/loader');
    var Player = require('game/player');
    var Talkable = require('game/talkable');
    var SaloonWorld = require('game/world');

    // REGISTER RESOURCES TO LOAD HERE
    loader.register('tiles_player', 'img/player.png', 'image');
    loader.register('tiles_bar', 'img/tiles.png', 'image');
    loader.register('map_bar', 'maps/bar.tmx', 'map');

    // Callback run once all resources have been loaded.
    loader.loadAll().done(function() {
        // Initialize engine.
        var engine = new Engine(256, 224, 3, new SaloonWorld());
        engine.bg_color = '#000000';

        // ADD INITIAL STATE (entities, worlds, etc) HERE
        engine.addEntity(new Player(5 * 16, 6 * 16));

        // ADD TALKABLE PLAYER
        engine.addEntity(new Talkable(10 * 16, 8 * 16));

        // Create map.
        var map = loader.get('map_bar');
        var tilemap = new Tilemap(map.layers['tiles'].grid, 0, 0);

        // Create tuled graphic for rendering tilemap.
        tilemap.graphic = new TiledGraphic(loader.get('tiles_bar'),
                                           16, 16, 0, 0);
        engine.world.tilemap = tilemap;

        // Append canvas to screen and start the engine!
        document.querySelector('#game').appendChild(engine.canvas);
        engine.start();
    });
});
