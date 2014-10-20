## Required Javascript code

However the transformicons are mostly powered by CSS, a little piece of JavaScript is required to toggle the transformed states.

```javascript
function $$(selector, root) {
	return Array.prototype.slice.call((root || document).querySelectorAll(selector));
}

function toggleTcons(event) {
	var tcon_state = 'is-transformed';
	this.classList[this.classList.contains(tcon_state) ? 'remove' : 'add'](tcon_state);
	event.preventDefault();
}

var tconEvent = {
	click: true,
	touchstart: true
};

function handleTcons(tcon) {
	for (var prop in tconEvent) {
		tcon.addEventListener(prop, toggleTcons);
	}
}

var tcons = $$('[data-tcon="button"]');
tcons.forEach(handleTcons);
```