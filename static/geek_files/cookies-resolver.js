function CookiesResolver() {

  var DEFAULT_COOKIE_DURATION_DAYS = 60;

  this.createCookie = function (name, value, duration) {
    var duration = (typeof duration !== 'undefined') ?  duration : DEFAULT_COOKIE_DURATION_DAYS;
    var date = new Date(); // today
    var expiryDate = date.getTime() + (duration * 24 * 60 * 60 * 1000); // milliseconds
    date.setTime(expiryDate);
    var expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  this.deleteCookie = function (name) {
    document.cookie = name + "=; expires=" + (new Date()).toUTCString() + "; path=/;";
  };

  this.getCookie = function (name) {
    var name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookies = decodedCookie.split(';');
    for(var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return "";
  };

}