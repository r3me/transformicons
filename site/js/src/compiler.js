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

  function render(type, data) {
    $('code.language-' + type).html('').append($('<textarea />').html(data || ''));

    // Come back to this. I feel this portion affects the usability as Prism removes the entire textarea
    // tag making it hard to copy and past from which are typical tasks for users using this portion.
    // Prism.highlightElement($('code.language-' + type)[0], true);
  }

  return function(options) {
    $(options.form).submit(function(e) {

      var input_style_val = $('input[name="tcon_stylesheet"]:checked').val(),
          input_js_val    = $('input[name="tcon_javascript"]:checked').val(),
          input           = options.input,
          type            = options.type;

      buildMarkup(input, function(err, data) {
          render('html', data);
      });

      if(input_style_val === 'css') {
        buildStyles(input, type.styles, function(err, data) {
          render('scss', data);
        });
      }

      if(input_style_val === 'scss') {
        buildStyles(input, type.styles, function(err, data) {
          render('scss', data);
        });
      }

      if(input_js_val === 'minified=true') {
        buildJS(type.js, function(err, data) {
          // render('javascript', data + "transformicons.add('.tcon');"); // see issue #56 https://github.com/grayghostvisuals/transformicons/issues/56
          render('javascript', data);
        });
      }

      if(input_js_val === 'minified=false') {
        buildJS(type.js, function(err, data) {
          // render('javascript', data + "transformicons.add('.tcon');"); // see issue #56 https://github.com/grayghostvisuals/transformicons/issues/56
          render('javascript', data);
        });
      }

      e.preventDefault();
    });
  };
})();

builder({
  form: '#tcon-builder',
  input: '.tcon-builder-input',
  type: {
    styles: 'tcon_stylesheet',
    js: 'tcon_javascript'
  }
});
