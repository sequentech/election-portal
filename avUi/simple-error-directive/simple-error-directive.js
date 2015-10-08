/*
 * Simple error directive.
 */
angular.module('avUi')
  .directive('avSimpleError', function($resource, $window) {
    function link(scope, element, attrs) {
      // moves the title on top of the busy indicator
      scope.updateTitle = function() {
        var title = element.find(".av-simple-error-title");

        // set margin-top
        var marginTop = - title.height() - 45;
        var marginLeft = - title.width()/2;
        title.attr("style", "margin-top: " + marginTop + "px; margin-left: " + marginLeft + "px");
      };

      scope.$watch(attrs.title,
        function() {
          scope.updateTitle();
        }
      );
    }
    return {
      restrict: 'AE',
      scope: {},
      link: link,
      transclude: true,
      templateUrl: 'avUi/simple-error-directive/simple-error-directive.html'
    };
  });