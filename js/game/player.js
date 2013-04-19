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

        this.level = 1;
        this.exp = 0;
        this.hp = 80;
        this.max_hp = 80;

        this.atk = 3;
        this.def = 1;
        this.speed = 2;
    }
    Player.prototype = Object.create(Entity.prototype);

    Player.prototype.tick = function() {
        Entity.prototype.tick.call(this);
        var kb = this.engine.kb;
        var dx = 0;
        var dy = 0;

        this.walking = false;
        if (kb.check(kb.RIGHT)) {
            this.direction = 'right';
            dx += 1;
        }
        if (kb.check(kb.LEFT)) {
            this.direction = 'left';
            dx -= 1;
        }
        if (kb.check(kb.UP)) {
            this.direction = 'up';
            dy -= 1;
        }
        if (kb.check(kb.DOWN)) {
            this.direction = 'down';
            dy += 1;
        }

        if(!this._dpress && !this._talkwait && kb.check(kb.D)) {
            this._depress = true;

            var tdx = 0;
            var tdy = 0;
            switch (this.direction) {
                case 'right':
                    tdx += 8; break;
                case 'left':
                    tdx -= 8; break;
                case 'up':
                    tdy -= 8; break;
                case 'down':
                    tdy += 8; break;
            }
            var talkable = this.getCollideEntity('talkable', tdx, tdy);
            if (talkable) {
                this._talkwait = true;
                talkable.talk();
            }
        } else if (!kb.check(kb.D)) {
            this._dpress = false;
            this._talkwait = false;
        }

        if (dx !== 0 || dy !== 0) {
            if (dx && !this.collideTilemap(this.world.tilemap, 'solid', dx, 0)) {
                this.x += dx;
                this.walking = true;
            }

            if (dy && !this.collideTilemap(this.world.tilemap, 'solid', 0, dy)) {
                this.y += dy;
                this.walking = true;
            }

            if (this.walking) {
                this.battleChance += (Math.random() * 0.001);
                if (Math.min(Math.random() + 0.1, 0.8) < this.battleChance) {
                    this.battleChance = 0;
                    this.engine.triggerBattle();
                }
            }
        }

        var tile = (this.walking ? 'walk_' : '') + this.direction;
        this.graphic.currentTile = tile;
    };

    Player.prototype.addExp = function(exp) {
        this.exp += exp;
    };

    return Player;
});
