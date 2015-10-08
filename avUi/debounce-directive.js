// source: https://gist.github.com/tommaitland/7579618#file-ng-debounce-js
angular.module('avUi')
  .directive('avDebounce', function($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 99,
      link: function(scope, elm, attr, ngModelCtrl) {
        if (attr.type === 'radio' || attr.type === 'checkbox') {
          return;
        }
        elm.unbind('input');
        var debounce;

        elm.bind('input', function() {
          $timeout.cancel(debounce);
          debounce = $timeout( function() {
            scope.$apply(function() {
              ngModelCtrl.$setViewValue(elm.val());
            });
          }, attr.avDebounce || 500);
        });

        elm.bind('blur', function() {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(elm.val());
          });
        });
      }
    };
});