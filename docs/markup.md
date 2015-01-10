## Markup

### Foundation

Our markup is strong and built with [A11Y](http://a11yproject.com) in mind. Since not all screen readers know what ``aria-label`` is yet
we've chosen to include important text in a ``.tcon-visuallyhidden`` span using the [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate/blob/master/dist/css/main.css#L133-L142) method that is screen reader friendly.

**Buttons**
```html
<button type="button" class="tcon" aria-label="[description]">
  <span class="" aria-hidden="true"></span>
  <span class="tcon-visuallyhidden">[screen reader text]</span>
</button>
```

**Symbols/Icons**
```html
<span class="tcon" aria-hidden="true"></span>
```