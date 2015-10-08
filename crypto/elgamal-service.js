/*
 * Convenience service that returns access to the sjcl
 */

angular.module('avCrypto')
  .service('ElGamalService', function() {
    /* jshint ignore:start */
    return ElGamal;
    /* jshint ignore:end */
  });
