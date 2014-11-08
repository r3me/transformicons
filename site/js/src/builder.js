require(['config', 'globals', 'compiler', '../lib/transformicons'], function(config, globals, builder, transformicons) {
  transformicons.add('.tcon');

  builder({
    form: '#builder',
    input: '.tcon-builder-input',
    output: '#tcon-source__styles',
    type: 'tcon_stylesheet'
  });
});