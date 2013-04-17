define(function(require) {
    var Entity = require('flux/entity');
    var Graphic = require('flux/graphics/graphic');

    var loader = require('game/loader');

    loader.register('enemy_barfighter1', 'img/barfighter1.png', 'image');

    function Enemy(x, y, name) {
        Entity.call(this, x, y);
        this.graphic = new Graphic(loader.get('enemy_barfighter1'));
        this.name = name;
    }
    Enemy.prototype = Object.create(Entity.prototype);

    return Enemy;
});
