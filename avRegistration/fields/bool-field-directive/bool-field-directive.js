angular.module('avRegistration')
  .directive('avrBoolField', function($state) {
    return {
      restrict: 'AE',
      scope: true,
      templateUrl: 'avRegistration/fields/bool-field-directive/bool-field-directive.html'
    };
  });
