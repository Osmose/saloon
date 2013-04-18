define(function(require) {
    /**
     * A procession of events. Useful for powering an animation or other timed
     * series of events within the game loop.
     *
     * @param length Length of the procession, in frames.
     * @param events Object that maps frame indexes with functions. The
     *               procession will execute each function at the associated
     *               frame index. Frames are 1-indexed.
     * @param context Optional argument specifying the value of `this` within
     *                the event functions.
     */
    function Procession(length, events, context) {
        this.length = length;
        this.events = events;
        this.context = context;
        this.currentFrame = 0;
    }

    Procession.prototype.tick = function() {
        if (!this.isComplete()) {
            this.currentFrame++;

            if (this.events.hasOwnProperty(this.currentFrame)) {
                this.events[this.currentFrame].call(this.context);
            }
        }
    };

    Procession.prototype.isComplete = function() {
        return this.currentFrame >= this.length;
    };

    return Procession;
});
