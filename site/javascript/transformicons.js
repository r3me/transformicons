(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
    		// AMD module
        define(factory);
    } else {
        // Browser global
        root.transformicons = factory();
    }
}(this || window, x = function () {

	// MODULE TRANSFORMICON
	"use strict";

	var SETTINGS = {
		container: document,
		selector: '[data-tcon="icon"]',
		transformClass : 'is-transformed',
		eventTransform : "click touchstart",
		eventRevert : "click touchstart"
	}

	var
		tcon = {}, // static class
		eventTypes = ["eventTransform", "eventRevert"];

	var updateListeners = function (remove) {
		var
			method = (remove ? 'remove' : 'add') + 'EventListener',
			elements = Array.prototype.slice.call(SETTINGS.container.querySelectorAll(SETTINGS.selector));
			
		elements.forEach(function(element) {
			eventTypes.forEach(function (type) {
				SETTINGS[type].split(" ").forEach(function(event) {
					element[method](event, handleEvent);
				});
			});
		});
	}

	var handleEvent = function (event) {
		this.classList[this.classList.contains(SETTINGS.transformClass) ? 'remove' : 'add'](SETTINGS.transformClass);
		// event.preventDefault();
	};

	// public
	tcon.init = function (options) {
		updateListeners(true);
		for (var prop in options) {
			SETTINGS[prop] = options[prop];
		}
		updateListeners();
		return tcon;
	}

	return tcon;
}));