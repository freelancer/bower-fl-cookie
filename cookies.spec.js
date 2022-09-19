'use strict';

describe('Service: CookieStore', function () {

  // load the service's module
  beforeEach(module('flCookies'));

  // instantiate service
  var CookieStore;

  beforeEach(inject(function (_CookieStore_) {
    CookieStore = _CookieStore_;
  }));

  // get / set
  it('should set a cookie and retrieve the value of a cookie', function () {
    CookieStore.put('string', 'hello!');
    CookieStore.put('number', 123);
    CookieStore.put('specialCharacters', '!@#$%^&&*()[];\',./{}:"<>?"');
    CookieStore.put('withInfinityExpiryDate', 'Infinity', {expires: Infinity});

    // expire as Number
    CookieStore.put('withExpiryDateAsNumber', 'blahblah', {
      expires: 4126464000000 // <---- 10 / 06 / 2100
    });

    // expire as String
    CookieStore.put('withExpiryDateAsNumber', 'blahblah', {
      expires: 'Fri, 31 Dec 9999 23:59:59 GMT'
    });

    // expire as Date
    CookieStore.put('withExpiryDateAsDate', 'blahblah', {
      expires: new Date(4126464000000)  // <---- 10 / 06 / 2100
    });

    // more options
    CookieStore.put('withAllTheRest', 'blahblah', {
      domain: 'freelancer.com',
      path: '/',
      secure: true
    });

    expect(CookieStore.get('string')).toEqual('hello!');
    expect(CookieStore.get('specialCharacters'))
      .toEqual('!@#$%^&&*()[];\',./{}:"<>?"');
    expect(CookieStore.get('withInfinityExpiryDate')).toEqual('Infinity');
    expect(CookieStore.get('number')).toEqual('123');
    expect(CookieStore.get('withExpiryDateAsNumber')).toEqual('blahblah');
    expect(CookieStore.get('withExpiryDateAsDate')).toEqual('blahblah');
  });

  // remove
  it('should remove a cookie', function () {
    var options = {domain: 'freelancer.com'};

    CookieStore.put('removeWith', 'options', options);
    CookieStore.put('removeWithout', 'options');

    CookieStore.remove('removeWith', options);
    CookieStore.remove('removeWithout');

    expect(CookieStore.get('removeWith')).toBeNull();
    expect(CookieStore.get('removeWithout')).toBeNull();
  });

  // empty string
  it('should treat an empty string as null', function () {
    CookieStore.put('emptyString', '');

    expect(CookieStore.get('emptyString')).toBeNull();
  });

  it('should return correct cookie for desktop www.freelancer.com',
   function () {
    var cookieDomain = CookieStore.getDomain('www.freelancer.com');
    expect(cookieDomain).toBe('.freelancer.com');
  });

  it('should return correct cookie domain ' +
    'for flndev training.syd1.fln-dev.net', function () {
    var cookieDomain =
      CookieStore.getDomain('training.syd1.fln-dev.net');
    expect(cookieDomain).toBe('training.syd1.fln-dev.net');
  });

  it('should return correct cookie ' +
  'for desktop www.fr.freelancer.com', function () {
    var cookieDomain = CookieStore.getDomain('www.fr.freelancer.com');
    expect(cookieDomain).toBe('.freelancer.com');
  });

  it('should return correct cookie ' +
  'for mobile m.freelancer.com', function () {
    var cookieDomain = CookieStore.getDomain('m.freelancer.com');
    expect(cookieDomain).toBe('.freelancer.com');
  });

  it('should return correct cookie ' +
  'for mobile m.freelancer.com.au', function () {
    var cookieDomain = CookieStore.getDomain('m.freelancer.com.au');
    expect(cookieDomain).toBe('.freelancer.com.au');
  });

  // it('should serialize and deserialize objects to json', function() {
  //   CookieStore.put('objectCookie', {id: 123, name: 'blah'});

  //   var cookieContent = CookieStore.get('objectCookie');

  //   expect(cookieContent).not.toBeNull();
  //   expect(cookieContent.id).toEqual('123');
  //   expect(cookieContent.name).toEqual('blah');
      // expect(cookieContent).toEqual(jasmine.objectContaining({
      //   id: 123,
      //   name: 'blah'
      // }));
  // });

});
