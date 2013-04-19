define(function(require) {
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('game/loader');

    loader.register('enemy_thug', 'img/barfighter1.png', 'image');

    function Enemy(x, y, type) {
        Entity.call(this, x, y);
        this.type = type;

        var attrs = Enemy.types[type];
        this.name = attrs.name;
        this.graphic = new TiledGraphic(loader.get(attrs.graphic.id),
                                        attrs.graphic.tileWidth,
                                        attrs.graphic.tileHeight);
        this.graphic.addTileName('normal', 0);
        this.graphic.addAnimationName('flashing', [0, 8, 1, 8]);
        this.graphic.currentTile = 'normal';

        this.hp = attrs.hp;
        this.atk = attrs.atk;
        this.def = attrs.def;
        this.speed = attrs.speed;
        this.exp = attrs.exp;

        this.time = 0;
    }
    Enemy.prototype = Object.create(Entity.prototype);

    Enemy.prototype.attack = function(player) {
        var multiplier = (100 + (Math.random() * 20)) / 100;
        var dmg = Math.floor(this.atk * multiplier) - player.def;
        player.hp -= dmg;
        return dmg;
    };

    Enemy.prototype.addTime = function() {
        if (this.time < 100) {
            this.time += this.speed;
        }
    };

    Enemy.types = {
        thug: {
            name: 'Drunken Thug',
            graphic: {
                id: 'enemy_thug',
                tileWidth: 24,
                tileHeight: 32
            },
            hp: 4,
            atk: 5,
            def: 1,
            speed: 1,
            exp: 2
        }
    };

    return Enemy;
});
