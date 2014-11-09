define(['jquery'], function($) {
  var builder = (function() {
    'use strict';

    var BASE = '/build/';

    function getQueryString(input) {
      return $(input + ':checked').map(function() {
        return $(this).data('transform');
      }).get().join('&');
    }

    function getRadioValue(name) {
      return $('input[name="' + name + '"]:checked').val();
    }

    function buildStyles(input, type, cb) {
      var qs = getQueryString(input),
          stylesheet, url;

      if (!qs.length) {
        cb && cb({ err: 'nothing to query'});
        return;
      }

      stylesheet = getRadioValue(type) || 'css';
      url = window.location.origin + BASE + stylesheet + '?' + qs;
      $.get(url, function(data) {
          cb && cb(null, data);
        });
    }

    function buildJS(type, cb) {
      var url = window.location.origin + BASE + 'js?minify=',
          minify = getRadioValue(type);

      $.get(url + minify, function(data) {
          cb && cb(null, data);
        });
    }

    return function(options) {
      $(options.form).submit(function(e) {

        buildStyles(options.input, options.type.styles, function(err, data) {
          $(options.output.styles).html(data || '');
        });

        buildJS(options.type.js, function(err, data) {
          $(options.output.js).html(data || '');
        });

        e.preventDefault();
      });
    };

  })();

  return builder;
});
