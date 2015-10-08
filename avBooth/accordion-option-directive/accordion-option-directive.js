/*
 * Directive that shows an accordion option.
 */
angular.module('avBooth')
  .directive('avbAccordionOption', function() {

    var link = function(scope, element, attrs) {
      scope.urls = _.object(_.map(scope.option.urls, function(url) {
        return [url.title, url.url];
      }));

      scope.showCategory = false;
      if (!!attrs.showCategory) {
        scope.showCategory = true;
      }

      scope.showSelectedPos = false;
      if (!!attrs.showSelectedPos) {
        scope.showSelectedPos = true;
      }

      scope.isPreset = (scope.showSelectedPos && scope.presetSelectedSize > 0 && scope.option.selected - scope.presetSelectedSize < 0);
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/accordion-option-directive/accordion-option-directive.html'
    };
  });