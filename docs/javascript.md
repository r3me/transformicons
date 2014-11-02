## Javascript

### Benefits
Transformicons are mostly powered by CSS however, a little piece of JavaScript is required to toggle the transformed states. We've taken the time to ensure the greatest amount of flexibility has been given to the code so that you the author can have…

- **Full Event Control** : A user should be able to define arbitrary events and specify which one should transform and which one reverts the icon. We allow you to choose, but by default we use click and touchstart.
- **UMD Pattern** : Using the Universal Module Definition pattern supports synchronous and asynchronous loading like [require.js](http://requirejs.org). In synchronous mode the global transformicon is exported, while with asynchronous loading a reference can be custom.
- **Encapsulation** : Polluting the global namespace is bad practice. We only add the global handle (``transformicon``) to the root, if loaded synchronously.

### Arguments

- ``elements (string|element|array)`` - Selector, DOM element or Array of DOM elements to be toggled
- ``events {object}`` - An Object containing one or more special event definitions
	- ``transform {(string|array)}`` - One or more events that trigger the transform. Can be an Array or string with events seperated by space.
	- ``revert {(string|array)}`` - One or more events that trigger the reversion. Can be an Array or string with events seperated by space.

### Methods

**``transformicons.add(elements, events)``**	
Adds functionality to elements. If no events are supplied, the default click events are used.

**``transformicons.transform(elements)``**	
Manually trigger a transform

**``transformicons.remove(elements, events)``**	
Removes functionality from elements. If no events are supplied, the default click events are used.

**``transformicon.revert(elements)``**	
Manually trigger reversion to original state.

**``transformicon.toggle(elements)``**	
Toggle between transformed and original state.

### Example

```javascript
transformicons.add('.tcon') // add default behavior for all elements with the class .tcon
              .remove('.tcon-menu--xcross') // remove default behavior for the first icon
              .add('.tcon-menu--xcross', {
              	transform: "mouseover",
              	revert: "mouseout"
              }); // add new behavior for the first icon
```



