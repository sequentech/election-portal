/*
 * Convenience service that returns access to the Random library
 */

angular.module('avCrypto')
  .service('RandomService', function() {
    /* jshint ignore:start */
    return Random;
    /* jshint ignore:end */
  });
