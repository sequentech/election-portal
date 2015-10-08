angular.module('avAdmin')
  .directive('avCensusField', function() {
    function link(scope, element, attrs) {
      if (scope.field.type === 'dict') {
        try {
          scope.dictVal = angular.fromJson(scope.c.metadata[scope.field.name]);
        } catch(e) {
          scope.dictVal = {};
        }
      }
    }

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avAdmin/admin-directives/census-field/census-field.html'
    };
  });
