var builder = (function() {
  'use strict';

  var BASE = '/build/';

  function getQueryString(input) {
    return $(input + ':checked').map(function() {
      return $(this).data('transform');
    })
    .get()
    .join('&');
  }


  function getRadioValue(name) {
    var val = $('input[name="' + name + '"]:checked').val();
    return val;
  }


  function getBase() {
    return window.location.origin + BASE;
  }


  function buildStyles(input, type, cb) {
    var qs = getQueryString(input),
        url;

    if (!qs.length) {
      cb && cb({ err: 'nothing to query'});
      return;
    }

    url = getBase() + (getRadioValue(type) || 'css') + '?' + qs;

    $.get(url, function(data) {
      cb && cb(null, data);
    });
  }


  function buildJS(type, cb) {
    var url = getBase() + 'js?' + getRadioValue(type);

    $.get(url, function(data) {
      cb && cb(null, data);
    });
  }


  return function(options) {
    $(options.form).submit(function(e) {

      var input_style_val = $('input[name="tcon_stylesheet"]:checked').val(),
          input_js_val    = $('input[name="tcon_javascript"]:checked').val();

      if(input_style_val === 'css') {
        buildStyles(options.input, options.type.styles, function(err, data) {
          $(options.output.css).html(data || '');
        });
      }

      if(input_style_val === 'scss') {
        buildStyles(options.input, options.type.styles, function(err, data) {
          $(options.output.sass).html(data || '');
        });
      }

      if(input_js_val === 'minified=true') {
        buildJS(options.type.js, function(err, data) {
          $(options.output.jsmin).html(data || '');
        });
      }

      if(input_js_val === 'minified=false') {
        buildJS(options.type.js, function(err, data) {
          $(options.output.jsunmin).html(data || '');
        });
      }

      e.preventDefault();
    });
  };

})();

builder({
  form: '#tcon-builder',
  input: '.tcon-builder-input',
  output: {
    css: '#tcon-source__styles-css',
    sass: '#tcon-source__styles-sass',
    jsmin: '#tcon-source__js-min',
    jsunmin: '#tcon-source__js-unmin'
  },
  type: {
    styles: 'tcon_stylesheet',
    js: 'tcon_javascript'
  }
});