angular.module('avUi')
  .service('InsideIframeService', function() {
    return function() {
      try {
          return window.self !== window.top;
      } catch (e) {
          return true;
      }
    };
  });
