/*
 * Convenience service that returns access to the sjcl
 */

angular.module('avCrypto')
  .service('SjclService', function() {
    /* jshint ignore:start */
    return sjcl;
    /* jshint ignore:end */
  });
