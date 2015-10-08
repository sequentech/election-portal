/*
 * directive used to position an element always at the bottom, so that it's
 * always shown completely. There are two scenarios:
 * a) if the page has no scroll, we assume the element is shown, and do nothing
 * b) if the page has scroll, the bottom of the page is not completely (or at
 *    all) being shown, so we set the affixed element the class affix-bottom and
 *    make space for it giving some bottom margin in its parent element.
 *
 * As an optional trigger to the settings of the affix-bottom, you can also set
 * the data-force-affix-width attribute in the affixed element to a number of
 * pixels. If this attribute is set and the window width is less than this,
 * automatically the element will be affixed.
 */
angular.module('avUi')
  .directive('avAffixBottom', function($window, $timeout, $parse) {
    var affixBottomClass = "affix-bottom";
    var checkPosition = function(scope, instance, el, options) {

      var affix = false;
      var elHeight = $(el).actual('height');

      if (($("body").height() + elHeight > window.innerHeight) ||
          (instance.forceAffixWidth && window.innerWidth < instance.forceAffixWidth)) {
        affix = affixBottomClass;
      }

      if (instance.affixed === affix) {
        return;
      }

      instance.affix = affix;
      instance.setIsAffix(scope, affix);
      el.removeClass("hidden");

      if (!affix) {
        el.removeClass(affixBottomClass);
        $(el).parent().css("margin-bottom", instance.defaultBottomMargin);
      } else {
        el.addClass(affixBottomClass);

        // add bottom-margin automatically
        $(el).parent().css("margin-bottom", elHeight + "px");
      }

    };

    return {
      restrict: 'EAC',
      link: function(scope, iElement, iAttrs) {
        // instance saves state between calls to checkPosition
        var instance = {
          affix: false,
          getIsAffix: null,
          setIsAffix: angular.noop,
          defaultBottomMargin: iElement.css("margin-bottom"),
          forceAffixWidth: parseInt(iAttrs.forceAffixWidth, 10)
        };


        if (iAttrs.avAffixBottom.length > 0) {
          instance.getIsAffix = $parse(iAttrs.avAffixBottom);
          instance.setIsAffix = instance.getIsAffix.assign;
        }

        // timeout is used with callCheckPos so that we do not create too many
        // calls to checkPosition, at most one per 100ms
        var timeout;

        function callCheckPos() {
          timeout = $timeout(function() {
            $timeout.cancel(timeout);
            checkPosition(scope, instance, iElement, iAttrs);
          }, 100);
        }
        callCheckPos();

        // watch for window resizes and element resizes too
        angular.element($window).on('resize', callCheckPos);
        angular.element(document.body).on('resize', callCheckPos);
        console.log("iElement NOT resize, height = " + iElement.height());
        angular.element(iElement).on('resize', callCheckPos);
      }
    };

  });
