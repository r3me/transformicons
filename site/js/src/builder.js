require(['config', 'globals', 'compiler', 'tcontabs'], function(config, globals, builder, tcontabs) {

  // Build Junk
  // ===============================================

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


  // Scroll Animation For Submit
  // ===============================================

  var tconsource_os = $('#tcon-source').offset().top;

  $('input[type="submit"]').on('click', function() {
     $('html, body').animate({
      scrollTop: tconsource_os
    }, 350);
  });
});
