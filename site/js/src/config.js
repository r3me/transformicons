requirejs.config({
  baseUrl: 'js/src',
  paths : {
    'jquery': [
      '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
      'lib/jquery'
    ],
    'modernizr': 'lib/modernizr'
  },
  shim: {
    'modernizr': {
      exports: 'Modernizr'
    }
  }
});