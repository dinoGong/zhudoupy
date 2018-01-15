"use strict";

(function($) {
  $.fn.productTabsInit = function() {
    return this.each(function () {
      var maxHeight = 0,
          tabsContainer = $(this),
          tabNav = tabsContainer.find('.product-tabs__nav-item'),
          tabsPanels = tabsContainer.find('.product-tabs__tab-panel'),
          tabActiveClass = 'product-tabs__nav-item--active',
          tabPanelActiveClass = 'product-tabs__tab-panel--active';

      if (tabsContainer.length === 0) {
        return;
      }

      $('.product-tabs__content').css('position', 'relative');
      $(tabsPanels).css('position', 'absolute');

      tabsPanels.each(function(tab) {
        maxHeight = maxHeight > $(this).outerHeight() ? maxHeight : $(this).outerHeight();
      });
      $('.product-tabs__content').css('position', 'relative').css('height', maxHeight + 'px');

      $(tabNav).on('click', function(e) {
        e.preventDefault();
        var targetTab = $(tabsPanels).filter('[data-tab=' + $(this).data('tab-target') + ']');

        $(tabNav).not(this).removeClass(tabActiveClass).attr('aria-selected', false);
        $(this).addClass(tabActiveClass).attr('aria-selected', true);

        $(tabsPanels).not(targetTab).removeClass(tabPanelActiveClass).attr('aria-hidden', true);
        $(targetTab).addClass(tabPanelActiveClass).attr('aria-hidden', false);
      });
    });
  };

  $.fn.productsTrackLink = function(category, action, label) {
    var link = $(this)
    var url = link.attr('href');

    __gaTracker('send', 'event', category, action, label, {
      transport: 'beacon',
      hitCallback: function () {
        document.location = url;
      }
    });
  };

  $('.js-product-buy-now').each(function() {
    $(this).attr('href', '#buy-now-modal');
  });

  $('body').on('click', '.product-modal__reseller-link', function (event) {
    event.preventDefault();
    var $this = $(this);
    $this.productsTrackLink('Reseller Visit',
                            $this.data('product-id'),
                            $this.data('reseller-name'));
  });

  $('body').on('click', '.js-product-buy-now.product-button', function (event) {
    event.preventDefault();
    $(this).productsTrackLink('Products Modal', 'open');
  });

  $('body').on('click', '.js-product-buy-now.product-business-link', function (event) {
    event.preventDefault();
    $(this).productsTrackLink('Products Business Modal', 'open');
  });

  $('.js-product-tabs').productTabsInit();
})(jQuery);
