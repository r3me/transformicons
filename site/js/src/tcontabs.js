define(['jquery'], function($) {

  // Config
  // ===========================================================================

  var $tcontabs_panel           = $('.tcon-tabs__group > div'),
      $tcontabs_panel_one       = $('.tcon-tabs__group > div:first-of-type'),
      $tcontabs_panel_last      = $('.tcon-tabs__group > div:last-of-type'),
      $tcon_style_radio         = $('input[name="tcon_stylesheet"]:radio'),
      $tcon_js_radio            = $('input[name="tcon_javascript"]:radio'),
      $tcon_tabs_tab            = $('.tcon-tabs__tab'),
      $tcon_css_tab             = $('#css-tab'),
      $tcon_sass_tab            = $('#sass-tab'),
      $tcon_jsmin_tab           = $('#jsmin-tab'),
      $tcon_jsunmin_tab         = $('#jsunmin-tab'),
      active_tab_class          = 'active';


  // Methods
  // ===========================================================================

  function styleRadioChange() {
    var $tcon_style_radio_checked = $('input[name="tcon_stylesheet"]:checked'),
        input_style_val           = $tcon_style_radio_checked.val();

    if(input_style_val === 'css') {
      $tcontabs_panel.hide();
      $tcontabs_panel_one.show();
      $tcon_css_tab.addClass(active_tab_class);
      $tcon_sass_tab.removeClass(active_tab_class);
    } else {
      $tcontabs_panel.hide();
      $tcontabs_panel_last.show();
      $tcon_css_tab.removeClass(active_tab_class);
      $tcon_sass_tab.addClass(active_tab_class);
    }
  }


  function jsRadioChange() {
    var $tcon_js_radio_checked    = $('input[name="tcon_javascript"]:checked'),
        input_js_val              = $tcon_js_radio_checked.val();

    if(input_js_val === 'minified=true') {
      $tcontabs_panel.hide();
      $tcontabs_panel_one.show();
      $tcon_jsmin_tab.addClass(active_tab_class);
      $tcon_jsunmin_tab.removeClass(active_tab_class);
    } else {
      $tcontabs_panel_one.hide();
      $tcontabs_panel_last.show();
      $tcon_jsmin_tab.removeClass(active_tab_class);
      $tcon_jsunmin_tab.addClass(active_tab_class);
    }
  }


  function tconTabs(event) {
    event.preventDefault();

    var $this    = $(this),
        tabgroup = '#'+$this.parents('.tcon-tabs__nav').data('tabgroup'),
        others   = $this.closest('li').siblings().children('a'),
        target   = $this.attr('href');

    others.removeClass(active_tab_class);
    $this.addClass(active_tab_class);
    $(tabgroup).children('div').hide();
    $(target).show();
  }


  // Events
  // ===========================================================================

  $tcontabs_panel.hide();
  $tcontabs_panel_one.show();

  $tcon_style_radio.on('change', function() {
    styleRadioChange();
  });

  $tcon_js_radio.on('change', function() {
    jsRadioChange();
  });

  $tcon_tabs_tab.on('click touchstart', function(event) {
    tconTabs.call(this, event);
  });

});