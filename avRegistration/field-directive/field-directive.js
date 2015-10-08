/**
 * Shows a field
 */
angular.module('avRegistration')
  .directive('avrField', function($state) {
    function link(scope, element, attrs) {
      console.log("type = " + scope.field.type);
      scope.index = attrs.index;
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avRegistration/field-directive/field-directive.html'
    };
  });
