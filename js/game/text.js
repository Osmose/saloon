define(function(require) {
    var Entity = require('flux/entity');

    function Text(x, y, text) {
        Entity.call(this, x, y);
        this.text = text;

        this.dx = 0;
        this.dy = 0;
    }
    Text.prototype = Object.create(Entity.prototype);

    Text.prototype.tick = function() {
        Entity.prototype.tick.call(this);
        this.x += this.dx;
        this.y += this.dy;
    };

    Text.prototype.render = function(ctx) {
        ctx.font = '5px "Final Fantasy 2"';
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
    };

    return Text;
});
