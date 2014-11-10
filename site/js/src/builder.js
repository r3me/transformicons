require(['config', 'globals', 'compiler', '../lib/transformicons', 'tcontabs'], function(config, globals, builder, transformicons, tcontabs) {
  transformicons.add('.tcon');

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
});
