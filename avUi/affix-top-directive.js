/*
 * directive used to position an element always at the top. It just sets its
 * specified element with a margin-top to make space for the affixed element.
 * This is done dynamically, so that each time the affixed element's height
 * changes, the top-margin of the specified is recalculated and set.
 */
angular.module('avUi')
  .directive('avAffixTop', function($window, $timeout) {

    // add margin-top automatically
    var updateMargin = function(el, options) {
      var minHeight = parseInt(options.minHeight);
      var height = Math.max(
        $(el).height(),
        (angular.isNumber(minHeight) && !isNaN(minHeight) ? minHeight : 0) );
      $(options.avAffixTop).css("padding-top", height + "px");
    };

    return {
      restrict: 'EAC',
      link: function(scope, iElement, iAttrs) {
        updateMargin(iElement, iAttrs);

        if (iAttrs.minHeight === undefined) {
          iAttrs.minHeight = "20";
        }

        // timeout is used with callCheckPos so that we do not create too many
        // calls to checkPosition, at most one per 100ms
        var timeout;

        function updateMarginTimeout() {
          timeout = $timeout(function() {
            $timeout.cancel(timeout);
            updateMargin(iElement, iAttrs);
          }, 100);
        }

        // watch for window resizes and element resizes too
        angular.element(iElement).bind('resize', updateMarginTimeout);
        angular.element($window).bind('resize', updateMarginTimeout);
        $(iAttrs.avAffixTop).change(updateMarginTimeout);
      }
    };

  });
