define(function(require) {
    var DefaultWorld = require('flux/worlds/default');
    var Keyboard = require('flux/input/keyboard');

    function DialogWorld(tilemap) {
        DefaultWorld.call(this);

        this.tilemap = tilemap;

        this.dialog = $('.dialog');

        this.kb = new Keyboard();
    }

    DialogWorld.prototype = Object.create(DefaultWorld.prototype);

    DialogWorld.prototype.render = function(ctx) {
        if (this.tilemap !== undefined) {
            this.tilemap.render(ctx);
        }

        DefaultWorld.prototype.render.call(this, ctx);
    };

    DialogWorld.prototype.tick = function () {

        var that = this;

        $('#game').on('keypress', function () {
            if (that.kb.check(that.kb.SPACE)) {
                that.dialog.hide();
            }
        });
    };

    return DialogWorld;
});