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

	// private functions
	var matchesSelector = (function (proto) { // little polyfill 
		var match = proto.matches || proto.matchesSelector;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var i = 0; !match && i<vendors.length; i++) {
			match = proto[vendors[i] + 'MatchesSelector']
		}
		return function (element, selector) {
			return match.call(element, selector);
		};
	})(Element.prototype);

	var updateListeners = function (remove) {
		var method = document[(remove ? 'remove' : 'add') + 'EventListener'];
		eventTypes.forEach(function (type) {
			var events = SETTINGS[type].split(" ");
			events.forEach(function(event) {
				method(event, handleEvent);
			});
		});
	}

	var handleEvent = function (event) {
		var
			elm = event.target,
			cls = SETTINGS.transformClass;
		while(elm !== SETTINGS.container) {
			if (matchesSelector(elm, SETTINGS.selector)) {
				if (elm.classList.contains(cls)) {
					if (SETTINGS.eventRevert.indexOf(event.type) >= 0) {
						elm.classList.remove(cls)
					}
				} else {
					if (SETTINGS.eventTransform.indexOf(event.type) >= 0) {
						elm.classList.add(cls)
					}
				}
				//event.preventDefault();
				break;
			}
			elm = elm.parentNode;
		}
	};

	// public
	tcon.config = function (options) {
		updateListeners(true); // remove
		for (var prop in options) {
			SETTINGS[prop] = options[prop];
		}
		updateListeners(); // readd
		return tcon;
	}

	updateListeners(); // init
	return tcon;
}));