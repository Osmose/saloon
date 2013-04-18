define(function(require) {
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('game/loader');

    loader.register('battle_player', 'img/battle.png', 'image');

    function BattlePlayer(x, y, player) {
        Entity.call(this, x, y);

        this.graphic = new TiledGraphic(loader.get('battle_player'), 24, 24);
        this.graphic.addTileName('standing', 0);
        this.graphic.addTileName('punch', 1);
        this.graphic.currentTile = 'standing';

        this.player = player;

        this.time = 20;
        this.acting = false;
        this.dx = 0;
        this.dy = 0;
    }
    BattlePlayer.prototype = Object.create(Entity.prototype);

    BattlePlayer.prototype.tick = function() {
        Entity.prototype.tick.call(this);
        this.x += this.dx;
        this.y += this.dy;
    };

    BattlePlayer.prototype.attack = function(enemy) {
        var multiplier = (100 + (Math.random() * 50)) / 100;
        var dmg = Math.floor(this.atk * multiplier) - enemy.def;
        enemy.hp -= dmg;
        return dmg;
    };

    BattlePlayer.prototype.addTime = function() {
        if (this.time < 100) {
            this.time += this.player.speed;
        }
    };

    function passthroughAttr(attr) {
        BattlePlayer.prototype.__defineGetter__(attr, function() { return this.player[attr]; });
        BattlePlayer.prototype.__defineSetter__(attr, function(v) { this.player[attr] = v; });
    }
    passthroughAttr('hp');
    passthroughAttr('max_hp');
    passthroughAttr('atk');
    passthroughAttr('def');
    passthroughAttr('speed');

    return BattlePlayer;
});
