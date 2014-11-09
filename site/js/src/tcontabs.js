define(['jquery'], function($) {

  $('.tcon-tabs__group > div').hide();
  $('.tcon-tabs__group > div:first-of-type').show();

  $('input[name="tcon_stylesheet"]:radio').change(function() {
    var input_style_val = $('input[name="tcon_stylesheet"]:checked').val();

    if(input_style_val === 'css') {
      $('.tcon-tabs__group > div').hide();
      $('.tcon-tabs__group > div:first-of-type').show();
      $('#css-tab').addClass('active');
      $('#sass-tab').removeClass('active');
    } else {
      $('.tcon-tabs__group > div').hide();
      $('.tcon-tabs__group > div:last-of-type').show();
      $('#css-tab').removeClass('active');
      $('#sass-tab').addClass('active');
    }
  });

  $('input[name="tcon_javascript"]:radio').change(function() {
    var input_js_val = $('input[name="tcon_javascript"]:checked').val();

    if(input_js_val === 'minified=true') {
      $('.tcon-tabs__group > div').hide();
      $('.tcon-tabs__group > div:first-of-type').show();
      $('#jsmin-tab').addClass('active');
      $('#jsunmin-tab').removeClass('active');
    } else {
      $('.tcon-tabs__group > div').hide();
      $('.tcon-tabs__group > div:last-of-type').show();
      $('#jsmin-tab').removeClass('active');
      $('#jsunmin-tab').addClass('active');
    }
  });

  $('.tcon-tabs__nav a').click(function(e){
    e.preventDefault();

    var $this    = $(this),
        tabgroup = '#'+$this.parents('.tcon-tabs__nav').data('tabgroup'),
        others   = $this.closest('li').siblings().children('a'),
        target   = $this.attr('href');
    others.removeClass('active');
    $this.addClass('active');
    $(tabgroup).children('div').hide();
    $(target).show();
  });
});