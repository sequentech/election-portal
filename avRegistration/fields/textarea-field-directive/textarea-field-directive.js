angular.module('avRegistration')
  .directive('avrTextareaField', function($state) {
    return {
      restrict: 'AE',
      scope: true,
      templateUrl: 'avRegistration/fields/textarea-field-directive/textarea-field-directive.html'
    };
  });
