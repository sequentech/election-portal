angular.module('avRegistration')
  .directive('avrIntField', function($state) {
    function link(scope, element, attrs) {
      if (angular.isUndefined(scope.field.regex)) {
        scope.re = new RegExp("");
      } else {
        scope.re = new RegExp(scope.field.regex);
      }

      // returns true if regex matches or if there's no regex
      scope.getRe = function(value) {
        return scope.re;
      };
    }
    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avRegistration/fields/int-field-directive/int-field-directive.html'
    };
  });
