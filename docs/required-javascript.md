## Required Javascript code

However the transformicons are mostly powered by CSS, a little piece of JavaScript is required to toggle the transformed states.

```javascript
	var transformicon = document.querySelectorAll('[data-transformicon="button"]');

	[].forEach.call(transformicon, function(transformicon) {
		var open = false;

		transformicon.onclick = function(event) {
			event.preventDefault();

			if(!open) {
				this.classList.add('is-transformed');
				open = true;
			} else {
				this.classList.remove('is-transformed');
				open = false;
			}
		}
	});
```