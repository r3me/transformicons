## Required Javascript

Transformicons are mostly powered by CSS however, a little piece of JavaScript is required to toggle the transformed states.

```javascript
var tconEvent = {
  click: true,
  touchstart: true
};

// Returns an array of nodes like jQuery
function $tcon(selector, root) {
  return Array.prototype.slice.call((root || document).querySelectorAll(selector));
}

function toggleTcons(event) {
  var tcon_state = 'is-transformed';
  this.classList[this.classList.contains(tcon_state) ? 'remove' : 'add'](tcon_state);
  event.preventDefault();
}

function handleTcons(tcon) {
  for (var prop in tconEvent) {
    tcon.addEventListener(prop, toggleTcons);
  }
}

var tcon_buttons = $tcon('[data-tcon="icon"]');
tcon_buttons.forEach(handleTcons);
```