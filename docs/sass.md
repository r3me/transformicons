## Sass

### Structure
Even though we provide a Vanilla CSS port we also support Sass (``.scss``). Authors have the option of using the transformicon builder in order to customize.
Each Sass partial is structured according to config, variation and icon(s) chosen. Your specific ``_icons.scss`` file will vary depending on your custom build
options chosen.

**_icons.scss**
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