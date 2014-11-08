// Simplified CommonJS Wrapping
// Only execute the factory function once all the dependencies 
// have been loaded and executed.
// http://simonsmith.io/writing-amd-compatible-plugins-for-jquery

define(function(require) {

  var $            = require('jquery'),
      Modernizr    = require('modernizr'),
      contributors = require('contributors'),
      hoverscroll  = require('disablehover');

  // Disable Hover on Scroll
  window.addEventListener('scroll', hoverscroll, false);
  contributors.ui.ghdata();
  contributors.ui.copyright();

});