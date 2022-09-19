'use strict';
/* exported CookieStoreMock */

/**
 * Mock version of our CookieStore service
 */
function CookieStoreMock () {
  this.cookies = [];

  this.get = function(key) {
    return this.cookies[key];
  };

  this.put = function (key, value) {
    this.cookies[key] = value;
  };

  this.remove = function (key) {
    this.cookies[key] = undefined;
  };

  this.getDomain = function() {
    return '.freelancer.com';
  };
}
