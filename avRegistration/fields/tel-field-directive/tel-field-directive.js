angular.module('avRegistration')
  .directive('avrTelField', function($state) {
    function link(scope, element, attrs) {
      scope.tlfPattern = /^[+]?\d{9,14}$/;
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avRegistration/fields/tel-field-directive/tel-field-directive.html'
    };
  });