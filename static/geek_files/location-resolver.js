function LocationResolver() {
  var COOKIE_NAME = "countryCode";

  var callbackFunction = function(countryCode) {};

  var cookiesResolver = new CookiesResolver();

  this.setLocation = function(countryCode) {
    cookiesResolver.createCookie(COOKIE_NAME, countryCode, 30);
  };

  this.getCurrentLocation = function(callback) {
    callbackFunction = callback;
    var countryCode = cookiesResolver.getCookie(COOKIE_NAME);
    if (!countryCode) {
      geoip2.country(successfullyResolvedLocation, failedToResolveLocation);
      return;
    }
    callbackFunction(countryCode);
  };

  function failedToResolveLocation() {
    Raven.captureMessage('Failed to resolve location')
    callbackFunction("");
  }

  function successfullyResolvedLocation(geoipResponse) {
    var countryCode = geoipResponse.country.iso_code;
    callbackFunction(countryCode);
    cookiesResolver.createCookie(COOKIE_NAME, countryCode);
  }
}
