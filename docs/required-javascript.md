## Required Javascript code

However the transformicons are mostly powered by Sass (CSS), a little piece of javascript is required.

```
	var transformicon = document.querySelectorAll('[data-transformicon="button"]');

	[].forEach.call(transformicon, function(transformicon){
		var open = false;

		transformicon.onclick = function(event){2
			event.preventDefault();

			if(!open) {
				this.classList.add('is--closed');
				open = true;
			} else {
				this.classList.remove('is--closed');
				open = false;
			}
		}
	});
```