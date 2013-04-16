define(function(require) {
    var DefaultWorld = require('flux/worlds/default');

    function SaloonWorld(tilemap) {
        DefaultWorld.call(this);

        this.tilemap = tilemap;
    }

    SaloonWorld.prototype = Object.create(DefaultWorld.prototype);

    SaloonWorld.prototype.render = function(ctx) {
        if (this.tilemap !== undefined) {
            this.tilemap.render(ctx);
        }

        DefaultWorld.prototype.render.call(this, ctx);
    };

    return SaloonWorld;
});
