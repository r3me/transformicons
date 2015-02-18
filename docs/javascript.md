## JavaScript

### Benefits
Transformicons are mostly powered by CSS however, a little piece of JavaScript is required to toggle the transformed states. We've taken the time to ensure the greatest amount of flexibility has been given to the code so that you the author can have…

- **Full Event Control** : A user should be able to define arbitrary events and specify which one should transform and which one reverts the icon. We allow you to choose, but by default we use ``click``.
- **UMD Pattern** : Using the Universal Module Definition pattern supports synchronous and asynchronous loading like [require.js](http://requirejs.org). In synchronous mode the global transformicon is exported, while with asynchronous loading a reference can be custom.
- **Encapsulation** : Polluting the global namespace is bad practice. We only add the global handle (``transformicon``) to the root, if loaded synchronously.

When integrating a custom build into your project the ``.add()`` method line below is required and should directly follow the transformicons JavaScript library we've provided.

```html
<script src="site/js/transformicons.js"></script>
<script>transformicons.add('.tcon')</script>
```

### Arguments

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>elements</code></th>
      <td>(string|element|array)</td>
      <td>Selector, DOM element or Array of DOM elements to be toggled</td>
    </tr>
    <tr>
      <th><code>events</code></th>
      <td>{object}</td>
      <td>An Object containing one or more special event definitions</td>
    </tr>
  </tbody>
</table>

### Objects

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>transform</code></th>
      <td><code>{(string|array)}</code></td>
      <td>One or more events that trigger the transform. Can be an Array or string with events seperated by space.</td>
    </tr>
    <tr>
      <th><code>revert</code></th>
      <td><code>{(string|array)}</code></td>
      <td>One or more events that trigger the reversion. Can be an Array or string with events seperated by space.</td>
    </tr>
  </tbody>
</table>


### Methods

<table>
  <thead>
    <tr>
      <th>Event Method</th>
      <th>Arguments</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>transformicons.add()</code></th>
      <td><code>elements, events</code></td>
      <td>Adds functionality to elements. If no events are supplied, the default click events are used</td>
    </tr>
    <tr>
      <th><code>transformicons.transform()</code></th>
      <td><code>elements</code></td>
      <td>Manually trigger a transform</td>
    </tr>
    <tr>
      <th><code>transformicons.remove()</code></th>
      <td><code>elements, events</code></td>
      <td>Removes functionality from elements. If no events are supplied, the default click events are used</td>
    </tr>
    <tr>
      <th><code>transformicon.revert()</code></th>
      <td><code>elements</code></td>
      <td>Manually trigger reversion to original state</td>
    </tr>
    <tr>
      <th><code>transformicon.toggle()</code></th>
      <td><code>elements</code></td>
      <td>Toggle between transformed and original state</td>
    </tr>
  </tbody>
</table>

**example**

```javascript
transformicons.add('.tcon') // add default behavior for all elements with the class .tcon
              .remove('.tcon-menu--xcross') // remove default behavior for the first icon
              .add('.tcon-menu--xcross', {
              	transform: "mouseover",
              	revert: "mouseout"
              }); // add new behavior for the first icon
```