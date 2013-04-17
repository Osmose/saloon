define(function(require) {
    var $ = require('jquery');

    function Chat(textarea, input) {
        var self = this;

        this.$textarea = $(textarea);
        this.$input = $(input);

        this.$input.keydown(function(e) {
            e.stopPropagation();
        });
    }

    return Chat;
});
