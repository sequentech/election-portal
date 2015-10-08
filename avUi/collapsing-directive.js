/*
 * avCollapsing limits the default maximum height of an element by making it
 * collapsable if it exceeds the max-height of the selector.
 *  - if the element's height doesn't exceed its maximum height, the
 *    data-toggle-selector element will be set to hidden
 *  - if the element's height exceeds its maximum height, the
 *    data-toggle-selector element will be removed the class "hidden".
 *  - if the data-toggle-selector element it contains is clicked, they will be
 *    added the class ".in".
 *  - if the element's height exceeds its max height and the toggle is not
 *    ".in", then it adds the ".collapsed" class to the element, and makes sure
 *    the data-toggle-selector element is not hidden.
 *  - it will watch the element and window resizes to see if the conditions
 *    change.
 * - both maxHeightSelector and data-toggle-selector will be found using the
 *   parent selector as a base if the attribute "parent-selector" is set.
 *   Otherwise, it will directly a global angular.element() to find them.
 */
angular.module('avUi')
  .directive('avCollapsing', function($window, $timeout) {


    function collapseEl(instance, el) {
      var val = null;
      if (!!instance.collapseSelector) {
        val = select(instance, el, instance.collapseSelector);
      } else {
        val = angular.element(el);
      }
      return val;
    }

    function select(instance, el, selector) {
      var val;
      if (!!instance.parentSelector) {
        val = el.closest(instance.parentSelector).find(selector);
      } else {
        val = angular.element(selector);
      }
      return val;
    }

    var checkCollapse = function(instance, el, options) {
      var maxHeight = select(instance, el, instance.maxHeightSelector).css("max-height");
      var height = angular.element(el)[0].scrollHeight;

      if (maxHeight.indexOf("px") === -1) {
        console.log("invalid non-pixels max-height for " + instance.maxHeightSelector);
        return;
      }

      maxHeight = parseInt(maxHeight.replace("px", ""));

      // make sure it's collapsed if it should
      if (height > maxHeight) {
        // already collapsed
        if (instance.isCollapsed) {
          return;
        }
        instance.isCollapsed = true;
        collapseEl(instance, el).addClass("collapsed");
        select(instance, el, instance.toggleSelector).removeClass("hidden in");

      // removed collapsed and hide toggle otherwise
      } else {
        // already not collapsed
        if (!instance.isCollapsed) {
          return;
        }
        instance.isCollapsed = false;
        collapseEl(instance, el).removeClass("collapsed");
        select(instance, el, instance.toggleSelector).addClass("hidden");
      }
    };

    var toggleCollapse = function(instance, el, options) {
      // if it's collapsed, uncollapse
      if (instance.isCollapsed) {
        collapseEl(instance, el).removeClass("collapsed");
        select(instance, el, instance.toggleSelector).addClass("in");

      // collapse otherwise
      } else {
        collapseEl(instance, el).addClass("collapsed");
        select(instance, el, instance.toggleSelector).removeClass("in");
      }


      instance.isCollapsed = !instance.isCollapsed;
    };

    return {
      restrict: 'EAC',
      link: function(scope, iElement, iAttrs) {
        var instance = {
          isCollapsed: false,
          maxHeightSelector: iAttrs.avCollapsing,
          toggleSelector: iAttrs.toggleSelector,
          parentSelector: iAttrs.parentSelector,
          collapseSelector: iAttrs.collapseSelector
        };

        // timeout is used with callCheck so that we do not create too many
        // calls to checkPosition, at most one per 100ms
        var timeout;

        function callCheck() {
          timeout = $timeout(function() {
            $timeout.cancel(timeout);
            checkCollapse(instance, iElement, iAttrs);
          }, 100);
        }
        callCheck();


        function launchToggle() {
            toggleCollapse(instance, iElement, iAttrs);
        }

        // watch for window resizes and element resizes too
        angular.element($window).bind('resize', callCheck);
        angular.element(iElement).bind('resize', callCheck);

        // watch toggle's clicking
        angular.element(instance.toggleSelector).bind('click', launchToggle);
      }
    };

  });
