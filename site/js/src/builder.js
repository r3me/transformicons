require(['config', 'globals', 'compiler', '../lib/transformicons'], function(config, globals, builder, transformicons) {
  transformicons.add('.tcon');

  builder({
    form: '#builder',
    input: '.tcon-builder-input',
    output: {
    	styles: '#tcon-source__styles',
    	js: '#tcon-source__js'
    },
    type: {
      styles: 'tcon_stylesheet',
      js: 'tcon_javascript'
    }
  });
});
