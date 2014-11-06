## Sass

### Structure
Using the custom builder authors have the option to customize their Sass port of Transformicons.
Each Sass partial is structured according to config, variation and icon(s) chosen. Your specific ``_tcons.scss`` file will vary depending on your custom build
options chosen.

<code>**_tcons.scss**</code>
```scss
// Config
@import "base/config-globals";
@import "base/config-menu";
@import "base/config-utilities";
@import "base/global-styles";

// Variations
@import "style/menu-lines";

// Icons
@import "type/menu-xcross";
@import "type/menu-xbutterfly";
```