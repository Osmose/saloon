define(function(require) {
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');
    var Engine = require('flux/engine');

    var DialogWorld = require('game/dialogworld');
    var loader = require('game/loader');
    var Dialog = require('game/dialog');

    function Talkable(x, y) {
        Entity.call(this, x, y);

        this.graphic = new TiledGraphic(loader.get('tiles_player'),
                                        16, 16, 0, 0);
        this.graphic.addTileName('standing', 0);
        this.graphic.currentTile = 'standing';
        this.type = 'talkable';

        this.setHitbox(0, 0, 16, 16);

        // Create dialog element
        this.dialog = new Dialog();
    }
    Talkable.prototype = Object.create(Entity.prototype);

    Talkable.prototype.talk = function (text) {

        var that = this,
            kb = this.engine.kb;

        var dialogWorld = new DialogWorld();
        this.engine.pushWorld(dialogWorld, true, false);

        this.dialog.insert(text);
        this.dialog.show();

        $('#game').on('keypress', function () {
            if (kb.check(kb.SPACE) && that.engine.world === dialogWorld) {
                that.stopTalking();
            }
        });
    };

    Talkable.prototype.stopTalking = function () {
        this.dialog.hide();
        this.engine.popWorld();
    };

    return Talkable;
});
