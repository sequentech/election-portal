/**
 * Usage:
 *
 * <div>
 *    <div>I need some space, this is a sibling</div>
 *    <div av-auto-height>
 *        I stretch to the available height,
 *        calculated from the height available from .parent and my siblings.
 *    </div>
 * </div>
 */
angular.module('avUi')
  .directive('avAutoHeight', function($window, $timeout) {
    return {
      link: function(scope, element, attrs) {
        var sibling, recalculate, promise = null;

        sibling = function() {
          return element.closest(attrs.parentSelector).find(attrs.siblingSelector);
        };

        recalculate = function () {
          if (promise) {
            $timeout.cancel(promise);
          }
          promise = $timeout(function() {
            var additionalHeight = 0, height;
            if (!!attrs.additionalHeight) {
              additionalHeight = parseInt(attrs.additionalHeight, 10);
            }
            height = sibling().height();
            element.css('max-height', (height + additionalHeight) + "px");
          }, 100);
        };

        scope.$watch(
          function () {
            return sibling().height();
          },
          function (newValue, oldValue) {
            recalculate();
          });

        recalculate();
      }
    };
  }
);