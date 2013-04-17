define(function(require) {
    var Engine = require('flux/engine');

    var BattleWorld = require('game/battle/world');
    var SaloonWorld = require('game/world');

    function SaloonEngine(width, height, scale) {
        Engine.call(this, width, height, scale, new SaloonWorld());

        this._startBattle = false;
    }

    SaloonEngine.prototype = Object.create(Engine.prototype);

    SaloonEngine.prototype.triggerBattle = function() {
        this._startBattle = true;
    };

    SaloonEngine.prototype.loop = function() {
        if (this._startBattle) {
            var world = new BattleWorld();
            this.pushWorld(world);
            this._startBattle = false;
        }

        Engine.prototype.loop.call(this);
    };

    return SaloonEngine;
});
