define(function(require) {
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('game/loader');

    function Player(x, y) {
        Entity.call(this, x, y);

        this.graphic = new TiledGraphic(loader.get('tiles_player'),
                                        16, 16, 0, 0);
        this.graphic.addTileName('standing', 0);
        this.graphic.currentTile = 'standing';

        this.setHitbox(0, 0, 16, 16);
    }
    Player.prototype = Object.create(Entity.prototype);

    Player.prototype.tick = function() {
        Entity.prototype.tick.call(this);
        var kb = this.engine.kb,
            talkable;

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

        if(kb.check(kb.D)) {
            talkable = this.getCollideEntity('talkable', 5, 5);
            if(talkable) {
               talkable.talk('Fight!!!'); 
            }
        }

        if (this.walking) {
            switch (this.direction) {
                case 'up': this.y--; break;
                case 'down': this.y++; break;
                case 'left': this.x--; break;
                case 'right': this.x++; break;
            }
        }

        //var tile = (this.walking ? 'walk_' : '') + this.direction;
        //this.graphic.currentTile = tile;
    };

    return Player;
});
