## Required Javascript

Transformicons are mostly powered by CSS however, a little piece of JavaScript is required to toggle the transformed states.

```javascript
transformicons.add('[data-tcon="icon"]') // add default behavior for all elements with the data attribute
              .remove('.tcon-menu--xcross') // remove default behavior for the first icon
              .add('.tcon-menu--xcross', {transform: "mouseover", revert: "mouseout"}); // add new behavior for the first icon
```