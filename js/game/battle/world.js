define(function(require) {
    var $ = require('jquery');

    var DefaultWorld = require('flux/worlds/default');
    var Graphic = require('flux/graphics/graphic');
    var TiledGraphic = require('flux/graphics/tiled');
    var Tilemap = require('flux/tilemap');

    var BattlePlayer = require('game/battle/player');
    var Enemy = require('game/enemy');
    var Procession = require('game/procession');
    var Text = require('game/text');

    var loader = require('game/loader');

    loader.register('battle_bar', 'maps/battle_bar.tmx', 'map');
    loader.register('pointer', 'img/hand.png', 'image');

    function BattleWorld() {
        DefaultWorld.call(this);

        var map = loader.get('battle_bar');
        this.tilemap = new Tilemap(map.layers['tiles'].grid, 0, 0);
        this.tilemap.graphic = new TiledGraphic(loader.get('tiles_bar'),
                                                16, 16, 0, 0);

        this.enemies = [];
        this.exp = 0;

        this.block_tick = true;
        this.block_render = true;
        this._battleStarted = false;

        this.battlePlayer = null;

        this.$enemyInfo = $('#enemy-info');
        this.$playerInfo = $('#player-info');
        this.$battleChoices = $('#battle-choices');
        this.$battleMsg = $('#battle-msg');

        this.paused = false;
        this.currentProcession = null;
        this.cursorMode = null;
        this.currentAction = null;
        this.currentTarget = null;

        this.pointer = new Graphic(loader.get('pointer'));
    }

    BattleWorld.prototype = Object.create(DefaultWorld.prototype);

    BattleWorld.prototype.tick = function() {
        DefaultWorld.prototype.tick.call(this);

        if (!this._battleStarted) {
            this.initBattle();
            this._battleStarted = true;
        }

        // Handle menu actions.
        if (this.cursorMode !== null) {
            this.handleCursor();
        }

        if (this._victory) {
            this._victory = false;
            this.currentProcession = new Procession(
                256,
                BattleWorld.victoryProcessionEvents,
                this
            );
        }

        // If there is a current procession (animation), progress it and do
        // nothing else.
        if (this.currentProcession) {
            this.currentProcession.tick();
            if (this.currentProcession.isComplete()) {
                this.currentProcession = null;
            }
            return;
        }

        // Update timer if not paused.
        if (!this.paused) {
            if (!this.battlePlayer.acting) {
                this.battlePlayer.addTime();
                if (this.battlePlayer.time >= 100) {
                    this.playerAction();
                }
            }

            this.enemies.forEach(function(enemy) {
                enemy.addTime();
                if (enemy.time >= 100) {
                    this.enemyAction(enemy);
                }
            }, this);
        }
    };

    BattleWorld.prototype.render = function(ctx) {
        if (this.tilemap !== undefined) {
            this.tilemap.render(ctx);
        }

        DefaultWorld.prototype.render.call(this, ctx);

        if (this.cursorMode == 'target') {
            var targeted = this.enemies[this.currentTarget];
            this.pointer.render(ctx, targeted.x, targeted.y);
        }
    };

    BattleWorld.prototype.initBattle = function() {
        this.generateEnemies();

        this.battlePlayer = new BattlePlayer(16 * 13, 16 * 7,
                                             this.engine.player);
        this.addEntity(this.battlePlayer);

        this.$enemyInfo.empty();
        this.enemies.forEach(function(enemy) {
            this.$enemyInfo.append('<li>' + enemy.name + '</li>');
        }, this);

        this.$playerInfo.empty()
            .append('<dt id="p1-name">Charles</dt>')
            .append('<dd id="p1-health">' + this.battlePlayer.hp + ' / ' +
                    this.battlePlayer.max_hp + '</dd>');

        this.$battleChoices.empty().append('<li class="selected" data-action="fight">Fight</li>');

        this.$enemyInfo.show();
        this.$playerInfo.show();
    };

    BattleWorld.prototype.tearDownBattle = function() {
        this.$battleMsg.hide();
        this.$enemyInfo.hide();
        this.$playerInfo.hide();
        this.$battleChoices.hide();
    };

    BattleWorld.prototype.playerAction = function() {
        this.currentAction = null;
        this.cursorMode = 'action';
        this.$battleChoices.find('li').removeClass('selected').first().addClass('selected');
        this.$battleChoices.show();
        this.battlePlayer.acting = true;
    };

    BattleWorld.prototype.handleCursor = function() {
        var kb = this.engine.kb;

        if (this.cursorMode == 'action') {
            if (kb.pressed(kb.D)) {
                var choice = $('#battle-choices .selected');
                this.currentAction = choice.data('action');
                if (this.currentAction == 'fight') {
                    this.cursorMode = 'target';
                    this.currentTarget = 0;
                    choice.removeClass('selected');
                }
            }
        } else if (this.cursorMode == 'target') {
            if (kb.pressed(kb.D)) {
                if (this.currentAction == 'fight') {
                    this.cursorMode = null;
                    this.currentAction = null;
                    this.$battleChoices.hide();
                    this.fight();
                }
            }
        }
    };

    BattleWorld.prototype.fight = function() {
        this.currentProcession = new Procession(136, BattleWorld.fightProcessionData, this);
    };

    BattleWorld.prototype.kill = function(enemy) {
        this.enemies = this.enemies.filter(function(e) {
            return e.id !== enemy.id;
        });
        this.removeEntity(enemy);

        if (this.enemies.length === 0) {
            this._victory = true;
        }
    };

    BattleWorld.prototype.enemyAction = function(enemy) {

    };

    BattleWorld.prototype.generateEnemies = function() {
        this.enemies = [new Enemy(16 * 2, 16 * 6, 'thug')];
        this.exp = this.enemies.reduce(function(exp, enemy) {
            return exp + enemy.exp;
        }, 0);
        for (var k = 0; k < this.enemies.length; k++) {
            this.addEntity(this.enemies[k]);
        }
    };

    BattleWorld.fightProcessionData = {
        1: function() {
            this.battlePlayer.graphic.currentTile = 'walking';
            this.battlePlayer.dx = -0.5;
        },
        48:  function() {
            this.battlePlayer.dx = 0;
            this.battlePlayer.graphic.currentTile = 'standing';
            this.battlePlayer.x = (16 * 12) - 8;
        },
        64:  function() {
            this.battlePlayer.graphic.currentTile = 'punch';
            this.enemies[this.currentTarget].graphic.currentTile = 'flashing';
        },
        76: function() {
            var enemy = this.enemies[this.currentTarget];
            var dmg = this.battlePlayer.attack(enemy);
            this.dmgText = new Text(enemy.x + 10, enemy.y + 16, dmg);
            this.addEntity(this.dmgText);
            this.dmgText.dy = -1;
        },
        79: function() { this.dmgText.dy = 1; },
        88:  function() {
            this.battlePlayer.graphic.currentTile = 'walking';
            this.battlePlayer.dx = 0.5;
        },
        95: function() { this.dmgText.dy = -1; },
        98: function() { this.dmgText.dy = 1; },
        101: function() { this.dmgText.dy = -1; },
        104: function() { this.dmgText.dy = 0; },
        112: function() {
            this.enemies[this.currentTarget].graphic.currentTile = 'normal';
        },
        136:  function() {
            this.battlePlayer.dx = 0;
            this.battlePlayer.graphic.currentTile = 'standing';
            this.battlePlayer.x = 16 * 13;
            this.removeEntity(this.dmgText);
            this.dmgText = null;
            this.battlePlayer.acting = false;

            var enemy = this.enemies[this.currentTarget];
            if (enemy.hp <= 0) {
                this.kill(enemy);
            }
        }
    };

    BattleWorld.victoryProcessionEvents = {
        1: function() {
            this.$battleMsg.text('Victory!').show();
        },
        128: function() {
            this.battlePlayer.player.addExp(this.exp);
            this.$battleMsg.text('Gained ' + this.exp + ' experience!');
        },
        256: function() {
            this.tearDownBattle();
            this.engine.popWorld();
        }
    };

    return BattleWorld;
});
