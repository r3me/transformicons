## Sass

### Structure
Using the custom builder authors have the option to customize their Sass port of Transformicons.
Each Sass partial is structured according to config, variation and icon(s) chosen. Your specific ``_icons.scss`` file will vary depending on your custom build
options chosen.

**_tcons.scss**
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
@import "type/menu-arrows";
@import "type/menu-minus";
```