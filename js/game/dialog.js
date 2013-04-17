define(function(require) {

	var Engine = require('flux/engine');

	function Dialog () {

		var dialog = document.createElement('div');
		dialog.setAttribute('class', 'dialog');

		document.getElementById('game').appendChild(dialog);
		this.el = $('.dialog');
	}

	Dialog.prototype.show = function () {
		this.el.show();
	};

	Dialog.prototype.hide = function () {
		this.el.hide();
		this.clear();
	};

	Dialog.prototype.insert = function (text) {
		this.el.html(text);
	};

	Dialog.prototype.clear = function () {
		this.el.innerHTML = '';
	};

	Dialog.prototype.destroy = function () {
		this.el.remove();
	};

	return Dialog;
});