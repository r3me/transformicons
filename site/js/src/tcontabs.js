define(['jquery'], function($) {
  $('.tcon-tabs__group > div').hide();
  $('.tcon-tabs__group > div:first-of-type').show();
  $('.tcon-tabs__nav a').click(function(e){
    e.preventDefault();
      var $this = $(this),
          tabgroup = '#'+$this.parents('.tcon-tabs__nav').data('tabgroup'),
          others = $this.closest('li').siblings().children('a'),
          target = $this.attr('href');
      others.removeClass('active');
      $this.addClass('active');
      $(tabgroup).children('div').hide();
      $(target).show();
  });
});