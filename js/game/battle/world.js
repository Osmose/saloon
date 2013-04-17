define(function(require) {
    var $ = require('jquery');

    var DefaultWorld = require('flux/worlds/default');
    var TiledGraphic = require('flux/graphics/tiled');
    var Tilemap = require('flux/tilemap');

    var BattlePlayer = require('game/battle/player');
    var Enemy = require('game/enemy');

    var loader = require('game/loader');

    loader.register('battle_bar', 'maps/battle_bar.tmx', 'map');

    function BattleWorld() {
        DefaultWorld.call(this);

        var map = loader.get('battle_bar');
        this.tilemap = new Tilemap(map.layers['tiles'].grid, 0, 0);
        this.tilemap.graphic = new TiledGraphic(loader.get('tiles_bar'),
                                                16, 16, 0, 0);

        this.enemies = [];

        this.block_tick = true;
        this.block_render = true;
        this._battleStarted = false;

        this.battlePlayer = null;

        this.$enemyInfo = $('#enemy-info');
        this.$playerInfo = $('#player-info');
    }

    BattleWorld.prototype = Object.create(DefaultWorld.prototype);

    BattleWorld.prototype.tick = function() {
        if (!this._battleStarted) {
            this.initBattle();
            this._battleStarted = true;
        }

        DefaultWorld.prototype.tick.call(this);
    };

    BattleWorld.prototype.render = function(ctx) {
        if (this.tilemap !== undefined) {
            this.tilemap.render(ctx);
        }

        DefaultWorld.prototype.render.call(this, ctx);
    };

    BattleWorld.prototype.initBattle = function() {
        this.generateEnemies();

        this.battlePlayer = new BattlePlayer(16 * 13, 16 * 7,
                                             this.engine.player);
        this.addEntity(this.battlePlayer);

        this.$enemyInfo.empty();
        this.enemies.forEach(function(enemy) {
            this.$enemyInfo.append('<li>' + enemy.name + '</li>');
        }, this);

        this.$playerInfo.empty();
        this.$playerInfo.append('<dt id="p1-name">Charles</dt><dd id="p1-health">80/80</dd>');

        this.$enemyInfo.show();
        this.$playerInfo.show();
    };

    BattleWorld.prototype.generateEnemies = function() {
        this.enemies = [new Enemy(16 * 2, 16 * 6, 'Drunken Thug')];
        for (var k = 0; k < this.enemies.length; k++) {
            this.addEntity(this.enemies[k]);
        }
    };

    return BattleWorld;
});
