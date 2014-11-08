var builder = (function(document, undefined) {
  'use strict'

  function getQueryString(input) {
    var tmp = [];
    [].forEach.call(document.querySelectorAll(input), function(elm) {
      elm.checked && tmp.push(elm.getAttribute('data-transform'));
    });
    return tmp.join('&');
  }

  function getContent(type, qs, cb) {
    var request = new XMLHttpRequest(),
        url = window.location.origin + '/build/' + type + '?' + qs;

    request.open('GET', url, false);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        cb && cb(request.responseText);
      } else {
        console.warn('unknown error while reaching ' + url);
      }
    };
    request.send();
  }

  function getStylesheet(name) {
    var type = 'css';
    [].forEach.call(document.querySelectorAll('input[name="' + name + '"]'), function(elm) {
      if (elm.checked) {
        type = elm.value;
      }
    });
    return type;
  }

  function buildStyles(input, type, cb) {
    var queryString = getQueryString(input);
    if (!queryString.length) {
      cb && cb({ err: 'nothing to query'});
      return;
    }

    getContent(getStylesheet(type), queryString, function(data) {
      cb && cb(null, data);
    });
  }

  return function(options) {
    document.querySelector(options.form).addEventListener('submit', function(e) {
      buildStyles(options.input, options.type, function(err, data) {
        document.querySelector(options.output).innerHTML = data || '';
      })
      e.preventDefault();
    });
  }

})(this.document);
