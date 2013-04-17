define(function(require) {
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('game/loader');

    loader.register('battle_player', 'img/battle.png', 'image');

    function BattlePlayer(x, y, player) {
        Entity.call(this, x, y);

        this.graphic = new TiledGraphic(loader.get('battle_player'), 24, 24);
        this.graphic.addTileName('standing', 0);
        this.graphic.currentTile = 'standing';

        this.player = player;
    }
    BattlePlayer.prototype = Object.create(Entity.prototype);

    return BattlePlayer;
});
