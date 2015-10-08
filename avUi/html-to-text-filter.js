angular.module('avUi')
  .filter('htmlToText', function() {
    return function(text) {
      return angular.element('<div>'+text+'</div>').text();
    };
  });