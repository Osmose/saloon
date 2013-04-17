define(function(require) {
    var DefaultWorld = require('flux/worlds/default');
    var Dialog = require('game/dialog');

    function DialogWorld(text) {
        DefaultWorld.call(this);

        this.dialog = new Dialog();
        this.dialog.insert(text);
        this.dialog.show();

        this.block_tick = true;
        this._dpress = true;
    }
    DialogWorld.prototype = Object.create(DefaultWorld.prototype);

    DialogWorld.prototype.tick = function () {
        var kb = this.engine.kb;

        if (!this._dpress && kb.check(kb.D)) {
            this.dialog.destroy();
            this.engine.popWorld();
        } else if (!kb.check(kb.D)) {
            this._dpress = false;
        }
    };

    return DialogWorld;
});
