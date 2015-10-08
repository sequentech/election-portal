/**
 * Always scrolls to bottom the div to which the directive is attached when
 * the observed property is modified.
 *
 * Example:
 *
 *    <div av-autoscroll-down ng-bind-html="log"></div>
 */
angular.module('avUi')
  .directive('avScrollToBottom', function($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$watch(
          function () {
            return element.children().length;
          },
          function () {
            element.animate({ scrollTop: element.prop('scrollHeight') }, 300);
          }
        );
      }
    };
});