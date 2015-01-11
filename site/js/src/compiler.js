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

  function buildMarkup(input, cb) {
    // TODO: remove duplicate code
    var qs = getQueryString(input),
        url;

    if (!qs.length) {
      cb && cb({ err: 'nothing to query'});
      return;
    }

    url = getBase() + ('html') + '?' + qs;

    $.get(url, function(data) {
      cb && cb(null, data);
    });
  }

  function buildStyles(input, type, cb) {
    var qs = getQueryString(input),
        url;

    if (!qs.length) {
      cb && cb({ err: 'nothing to query' });
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
          input_js_val    = $('input[name="tcon_javascript"]:checked').val(),
          input           = options.input,
          type            = options.type,
          output          = options.output;

      buildMarkup(input, function(err, data) {
        $(output.html).html(data || '');
      });

      if(input_style_val === 'css') {
        buildStyles(input, type.styles, function(err, data) {
          $(output.css).html(data || '');
        });
      }

      if(input_style_val === 'scss') {
        buildStyles(input, type.styles, function(err, data) {
          $(output.sass).html(data || '');
        });
      }

      if(input_js_val === 'minified=true') {
        buildJS(type.js, function(err, data) {
          $(output.jsmin).html(data || '');
        });
      }

      if(input_js_val === 'minified=false') {
        buildJS(type.js, function(err, data) {
          $(output.jsunmin).html(data || '');
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
    html: '#tcon-src--html',
    css: '#tcon-src--styles',
    sass: '#tcon-src--styles',
    jsmin: '#tcon-src--js',
    jsunmin: '#tcon-src--js'
  },
  type: {
    styles: 'tcon_stylesheet',
    js: 'tcon_javascript'
  }
});