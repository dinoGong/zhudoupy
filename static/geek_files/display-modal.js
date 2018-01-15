(function($) {
  // find current location, trigger updating country UI and calling back to load products
  function detectCountry(cb) {
    var locationResolver = new LocationResolver();
    locationResolver.getCurrentLocation(function(countryCode) {
      cb(countryCode);
    });
  }

  // When country selected updated country UI and sets current location cookie
  function updateCountry(countryCode) {
    var locationResolver = new LocationResolver();
    locationResolver.setLocation(countryCode);
    $("#country-dropdown").val(countryCode);
  }

  // clears resellers from modal
  function clearResellers() {
    $(".product-modal__resellers-list").empty();
  }

  // loads resellers from API
  function loadResellers(productId, countryCode) {
    clearResellers();
    var resellers_api_version = 1;
    var $modalLoading = $(".product-modal__loading");
    var $modalResellers = $(".product-modal__resellers");
    var $modalResellersError = $modalResellers.find(
      ".product-modal__resellers-error"
    );
    var $modalResellersList = $modalResellers.find(
      ".product-modal__resellers-list"
    );
    var modalResellersLoadingClass = "product-modal__resellers--loading";
    var url =
      RESELLER_API_URL +
      "/product_links?country=" +
      countryCode +
      "&product=" +
      productId;

    if (window.business) {
      url += "&business=true";
    }

    $modalResellers.addClass(modalResellersLoadingClass);
    $modalResellersError.addClass("hidden");

    $.ajax({
      contentType: "application/json",
      type: "GET",
      headers: {
        Accept: "application/vnd.product-resellers.v" + resellers_api_version
      },
      url: url
    })
      .done(function(data) {
        var resellers = [];

        if (!data.length) {
          $modalResellersError.removeClass("hidden");
        }

        data.forEach(function(reseller) {
          resellers.push(
            "<li class='product-modal__reseller-item'><a href='" +
              urlWithQuery(reseller.url) +
              "' class='product-modal__reseller-link' data-product-id='" +
              productId +
              "' data-reseller-name='" +
              reseller.reseller.name +
              "'><img alt='" +
              reseller.reseller.name +
              "' src='" +
              reseller.reseller.logo +
              "' class='product-modal__reseller-logo'></a></li>"
          );
        });

        $modalResellersList.html(resellers.join(""));

        $modalResellers
          .removeClass(modalResellersLoadingClass)
          .on("transitionend", function() {
            $modalLoading.addClass("hidden");
          });
      })
      .fail(function(error) {
        $(".resellers-error").html(
          '<p>We’re unable to load resellers at this time, sorry. For a full list, please visit our <a href="/resellers">resellers page</a>.</p>'
        );

        $modalResellers
          .removeClass(modalResellersLoadingClass)
          .on("transitionend", function() {
            $modalLoading.addClass("hidden");
          });
      });
  }

  function urlWithQuery(url) {
    if (url.indexOf("?") == -1) {
      url += "?";
    } else {
      url += "&";
    }

    return (url += "src=raspberrypi");
  }

  // loads countries from API based on product
  function getCountries(productId) {
    var resellers_api_version = 1;
    var url = RESELLER_API_URL + "/countries?product=" + productId;

    if (window.business) {
      url += "&business=true";
    }

    $.ajax({
      type: "GET",
      headers: {
        Accept: "application/vnd.product-resellers.v" + resellers_api_version
      },
      url: url,
      contentType: "application/json"
    })
      .done(function(data) {
        var selectOptions = [];
        var cookiesResolver = new CookiesResolver();
        var countryCode = cookiesResolver.getCookie("countryCode");
        var inCountry = false;
        var defaultSelection = 'row';

        data.forEach(function(country) {
          if (country.code == countryCode.toLowerCase()){
            inCountry = true;
          }
          var elem =
            '<option value="' +
            country.code +
            '" class="product-modal__option">' +
            country.name +
            "</option>";
          selectOptions.push(elem);
        });

        selectOptions.push(
          '<option value="row" class="product-modal__option">Rest of the World</option>'
        );

        if (inCountry) {
          defaultSelection = countryCode.toLowerCase();
        }

        $("#country-dropdown")
          .html(selectOptions.join(""))
          .find("option[value=" + defaultSelection + "]")
          .prop("selected", "selected");
      })
      .fail(function(error) {
        $(".resellers-error").html(
          '<p>We’re unable to load countries at this time, sorry. For global resellers, please visit our <a href="/resellers">resellers page</a>.</p>'
        );
      });
  }

  // setup product modals
  // Check if the viewport is small, if it is, we will use fullscreen mode
  var fullscreen = window.matchMedia("(min-width: 400px)").matches
    ? false
    : true;

  $(".js-product-buy-now").modaal({ fullscreen: fullscreen });

  $(".js-product-buy-now").click(function(e) {
    e.preventDefault();
    var productId = $(this).data("productApiId");
    // Set whether the user chose the business option, set a flag if so
    window.business = typeof $(this).data("business") !== "undefined";

    detectCountry(function(countryCode) {
      $("#country-dropdown").data("productId", productId);
      getCountries(productId);
      updateCountry(countryCode);
      loadResellers(productId, countryCode);
    });
  });

  $("#country-dropdown").change(function(e) {
    e.preventDefault();
    var countryCode = $(this).val();
    var productId = $(this).data("productId");
    updateCountry(countryCode);
    loadResellers(productId, countryCode);
  });
})(jQuery);
