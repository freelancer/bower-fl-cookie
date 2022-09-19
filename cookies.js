'use strict';

/**
* @ngdoc overview
* @name flCookies
* @module flCookies
* @description
*
* # flCookies
* The `flCookies` module provides a single
* {@link flCookies.CookieStore CookieStore} service that
* streamlines the interaction with the browser's cookies.
* AngularJS has
* {@link https://docs.angularjs.org/api/ngCookies/service/$cookieStore
* its own $cookieStore implementation} but it doesn't support setting any
* cookie option (e.g. *path*, *domain*, *secure*,
* and *expiration*) as of today. The APIs are the same than Angular's
* {@link https://docs.angularjs.org/api/ngCookies/service/$cookieStore
* $cookieStore} with an extra parameter (an object with
* ``expires``, ``path``, ``domain`` and ``secure`` as keys, ``expires``
* accepting different formats).
* It is currently used by ``flAuth`` (auth cookies) and ``flAnalytics``
* (tracking cookies), but you can easily use it in a custom service:
*
* ```
  angular.module('myApp')
  .factory('myAwesomeService', function(CookieStore) {
    return {
      setMagicCookie: function(magicNumber) {
        CookieStore.put('CHUCK_NORRIS', magicNumber, {
          expires: Infinity
        });

      ...
    }
  }
* ```
*/
angular.module('flCookies', [])
  /**
   * @ngdoc service
   * @name flCookies.CookieStore
   *
   * @description
   * A factory which creates a service that lets you interact with the browser's
   * cookies.
   *
   * The returned object has action methods which provide high-level behaviors
   * without the need to interact with the low level cookies implementation.
   */
  .factory('CookieStore', function CookieStore($document) {
    return {
      /**
       * @ngdoc method
       * @name flCookies.CookieStore#get
       * @methodOf flCookies.CookieStore
       *
       * @description
       * Returns the value of given cookie key
       *
       * @param {String} key Id to use for lookup.
       * @returns {Object} Deserialized cookie value.
       */
      get: function(key) {
        var re = new RegExp('(?:(?:^|.*;)\\s*' +
            encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') +
            '\\s*\\=\\s*([^;]*).*$)|^.*$');
        var value = $document[0].cookie.replace(re, '$1');

        return decodeURIComponent(value) || null;
      },
      /**
       * @ngdoc method
       * @name flCookies.CookieStore#put
       * @methodOf flCookies.CookieStore
       *
       * @description
       * Sets a value for given cookie key
       *
       * @param {String} key Id for the `value`.
       * @param {Object} value The value you want to store in this cookie
       * @param {Object} options Additional settings for the cookie (optional):
       *
       * - expires: expiration date for the cookie
       * - domain: the domain for which the cookie is valid
       * - path: the path for which the cookie is valid
       * - secure: is cookie HTTPS only?
       */
      put: function(key, value, options) {
        // Set cookie
        var cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        // See options
        if (options) {
          // Expiration date
          if (options.expires) {
            var date;

            switch (options.expires.constructor) {
              case Number:
                if (options.expires === Infinity) {
                  date = 'Fri, 31 Dec 9999 23:59:59 GMT';
                } else {
                  // Note: we don't use max-age here because it's
                  // not supported in IE8.
                  var d = new Date();
                  d.setTime(d.getTime() + (options.expires * 1000));
                  date = d.toUTCString();
                }
                break;
              case String:
                date = options.expires;
                break;
              case Date:
                date = options.expires.toUTCString();
                break;
            }

            cookie += ';expires=' + date;
          }
          // Domain
          cookie += options.domain ? ';domain=' +  options.domain : '';
          // Path
          cookie += options.path ? ';path=' +  options.path : ';path=/';
          // HTTPS Only
          cookie += options.secure ? ';secure' : '';
          // SameSite for sharing cookies with other domains (eg. billing)

          var sameSite = options.sameSite;
          if (sameSite === 'None') {
            // some browsers reject cookies with SameSite=None
            // we can test functionality by setting and checking if it worked
            // https://www.chromium.org/updates/same-site/incompatible-clients
            this.remove('testsamesitenone');
            $document[0].cookie = 'testsamesitenone=1; secure; SameSite=None';
            if (this.get('testsamesitenone') !== '1') {
              // cookie didn't come back: don't set SameSite=None
              sameSite = '';
            }
            this.remove('testsamesitenone');
          }
          cookie += sameSite ? '; SameSite=' + sameSite : '';
        }
        // Save the cookie
        // Note: $document is a jqLite wrapper
        $document[0].cookie = cookie;
      },
       /**
       * @ngdoc method
       * @name flCookies.CookieStore#remove
       * @methodOf flCookies.CookieStore
       *
       * @description
       * Remove given cookie
       *
       * @param {String} key Id of the key-value pair to delete.
       * @param {Object} options Additional settings for the cookie (optional)
       */
      remove: function(key, options) {
        var opt = options || {};
        // Setting expiry date to a past date deletes a cookie
        opt.expires = new Date(0);
        this.put(key, '', opt);
      },
      /**
       * @ngdoc method
       * @name flCookies.CookieStore#getDomain
       * @methodOf flCookies.CookieStore
       *
       * @description
       * Get Cookie Domain by matching the regex `freelancer.*$`
       * and adding `.` front of it.
       * If it doesn't match the regex, just return the hostName.
       *
       * @param {String} hostName current host name
       *
       * @returns {String} Cookie Domain
       */
      getDomain: function(hostName) {
        return hostName.match(/freelancer.*$/) ?
          '.' + hostName.match(/freelancer.*$/)[0]
          : hostName;
      }
    };

  });
