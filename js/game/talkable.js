define(function(require) {
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');
    var Engine = require('flux/engine');

    var loader = require('game/loader');

    function Talkable(x, y) {
        Entity.call(this, x, y);

        this.graphic = new TiledGraphic(loader.get('tiles_player'),
                                        16, 16, 0, 0);
        this.graphic.addTileName('standing', 0);
        this.graphic.currentTile = 'standing';
        this.type = 'talkable';

        this.setHitbox(0, 0, 16, 16);
    }
    Talkable.prototype = Object.create(Entity.prototype);

    Talkable.prototype.talk = function (text) {

        var kb = this.engine.kb,
            dialog = $('.dialog').html(text);

        dialog.show();

        $('#game').on('keypress', function () {
            if (kb.check(kb.D)) {
                dialog.hide();
            }
        });
    };

    return Talkable;
});
