if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {

  // Disable Hover
  // thecssninja.com/javascript/pointer-events-60fps
  var body = document.body,
      timer;

  return function() {
    clearTimeout(timer);

    if(!body.classList.contains('disable-hover')) {
      body.classList.add('disable-hover');
    }

    timer = setTimeout(function() {
      body.classList.remove('disable-hover');
    }, 500);
  };

});