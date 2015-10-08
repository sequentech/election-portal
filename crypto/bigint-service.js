/*
 * Convenience service that returns access to the BigInt library
 */

angular.module('avCrypto')
  .service('BigIntService', function() {
    /* jshint ignore:start */
    return BigInt;
    /* jshint ignore:end */
  });
