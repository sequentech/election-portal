angular.module('avAdmin')
  .directive('avQuestionOptionDetails', function($state, ElectionsApi) {
    function link(scope, element, attrs) {
        scope.editting = false;
        if (scope.answer.urls.length !== 2) {
          scope.answer.urls = [
            {title: "URL", url: ""},
            {title: "Image URL", url: ""}
          ];
        }

        scope.answerBeingEdited = function() {
          return scope.internal.editingIndex === scope.answer.id;
        };

        scope.setEdit = function(edit, event) {
          if (edit === true) {
            scope.internal.editingIndex = scope.answer.id;
          } else {
            scope.internal.editingIndex = -1;
          }

          if (!!event) {
            event.preventDefault();
          }
        };
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avAdmin/admin-directives/question-option-details/question-option-details.html'
    };
  });
