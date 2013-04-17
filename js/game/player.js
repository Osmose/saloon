define(function(require) {
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('game/loader');

    function Player(x, y) {
        Entity.call(this, x, y);

        this.graphic = new TiledGraphic(loader.get('tiles_player'),
                                        16, 16, 0, 0);
        this.graphic.addTileName('down', 0);
        this.graphic.addTileName('up', 2);
        this.graphic.addTileName('left', 4);
        this.graphic.addTileName('right', 6);

        this.graphic.addAnimationName('walk_down', [1, 10, 0, 10]);
        this.graphic.addAnimationName('walk_up', [3, 10, 2, 10]);
        this.graphic.addAnimationName('walk_left', [5, 10, 4, 10]);
        this.graphic.addAnimationName('walk_right', [7, 10, 6, 10]);

        this.direction = 'down';
        this.walking = false;

        this.setHitbox(0, 0, 16, 16);

        this._dpress = false;
        this._talkwait = false;

        this.battleChance = 0;
    }
    Player.prototype = Object.create(Entity.prototype);

    Player.prototype.tick = function() {
        Entity.prototype.tick.call(this);
        var kb = this.engine.kb;

        this.walking = false;
        if (kb.check(kb.RIGHT)) {
            this.walking = true;
            this.direction = 'right';
        }
        if (kb.check(kb.LEFT)) {
            this.walking = true;
            this.direction = 'left';
        }
        if (kb.check(kb.UP)) {
            this.walking = true;
            this.direction = 'up';
        }
        if (kb.check(kb.DOWN)) {
            this.walking = true;
            this.direction = 'down';
        }

        if(!this._dpress && !this._talkwait && kb.check(kb.D)) {
            this._depress = true;
            var talkable = this.getCollideEntity('talkable', 5, 5);
            if (talkable) {
                this._talkwait = true;
                talkable.talk();
            }
        } else if (!kb.check(kb.D)) {
            this._dpress = false;
            this._talkwait = false;
        }

        if (this.walking) {
            switch (this.direction) {
                case 'up': this.y--; break;
                case 'down': this.y++; break;
                case 'left': this.x--; break;
                case 'right': this.x++; break;
            }

            this.battleChance += (Math.random() * 0.001);
            if (Math.min(Math.random() + 0.1, 0.8) < this.battleChance) {
                this.battleChance = 0;
                this.engine.triggerBattle();
            }
        }

        var tile = (this.walking ? 'walk_' : '') + this.direction;
        this.graphic.currentTile = tile;
    };

    return Player;
});
