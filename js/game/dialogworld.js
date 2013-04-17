define(function(require) {
    var DefaultWorld = require('flux/worlds/default');

    function DialogWorld(tilemap) {
        DefaultWorld.call(this);

        this.tilemap = tilemap;
    }

    DialogWorld.prototype = Object.create(DefaultWorld.prototype);

    DialogWorld.prototype.render = function(ctx) {
        if (this.tilemap !== undefined) {
            this.tilemap.render(ctx);
        }

        DefaultWorld.prototype.render.call(this, ctx);
    };

    return DialogWorld;
});