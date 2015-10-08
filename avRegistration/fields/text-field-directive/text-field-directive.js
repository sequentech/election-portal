angular.module('avRegistration')
  .directive('avrTextField', function($state) {
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
      templateUrl: 'avRegistration/fields/text-field-directive/text-field-directive.html'
    };
  });
