angular.module('avRegistration')
  .directive('avrEmailField', function($state, Patterns) {
    function link(scope, element, attrs) {
        scope.patterns = function(name) {
            return Patterns.get(name);
        };
    }
    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avRegistration/fields/email-field-directive/email-field-directive.html'
    };
  });
