angular.module('avRegistration')
  .directive('avrPasswordField', function($state) {
    return {
      restrict: 'AE',
      scope: true,
      templateUrl: 'avRegistration/fields/password-field-directive/password-field-directive.html'
    };
  });
