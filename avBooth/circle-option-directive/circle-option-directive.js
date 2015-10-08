/*
 * Directive that shows an option with a circled image.
 */
angular.module('avBooth')
  .directive('avbCircleOption', function() {

    var link = function(scope, element, attrs) {
      scope.urls = {};
      _.each(scope.option.urls, function(url) {
        scope.urls[url.title] = url.url;
      });
    };
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/circle-option-directive/circle-option-directive.html'
    };
  });