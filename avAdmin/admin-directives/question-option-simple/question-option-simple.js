angular.module('avAdmin')
  .directive('avQuestionOptionSimple', function($state, ElectionsApi) {
    function link(scope, element, attrs) {
        scope.editing = false;

        scope.setEdit = function(edit, event) {
          scope.editing = edit;

          if (!!event) {
            event.preventDefault();
          }
        };
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avAdmin/admin-directives/question-option-simple/question-option-simple.html'
    };
  });
