define(['jquery'], function($) {
  var builder = (function() {
    'use strict';

    function getQueryString(input) {
      return $(input + ':checked').map(function() {
        return $(this).data('transform');
      }).get().join('&');
    }

    function buildStyles(input, type, cb) {
      var qs = getQueryString(input),
          stylesheet, url;

      if (!qs.length) {
        cb && cb({ err: 'nothing to query'});
        return;
      }

      stylesheet = $('input[name="' + type + '"]:checked').val() || 'css';
      url = window.location.origin + '/build/' + stylesheet + '?' + qs;
      $.get(url, function(data) {
          cb && cb(null, data);
        });
    }

    return function(options) {
      $(options.form).submit(function(e) {
        buildStyles(options.input, options.type, function(err, data) {
          $(options.output).html(data || '');
        });
        e.preventDefault();
      });
    };

  })();

  return builder;
});
