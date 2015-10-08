/**
 * Shows the results of a specific question in an election
 */
angular.module('avElection')
  .directive('avQuestionResults', function($state) {
    // works like a controller
    function link(scope, element, attrs) {
      var mappings = {
        "plurality-at-large": "plurality-at-large",
        "borda-nauru": "borda",
        "borda": "borda",
        "pairwise-beta": "borda"
      };

      var key = scope.question.layout + "." + scope.question.tally_type;
      if (key in mappings) {
        $state.go(scope.statePrefix + "." + mappings[key]);
      } else {
        if (scope.question.tally_type in mappings) {
          $state.go(scope.statePrefix + "." + mappings[scope.question.tally_type]);
        } else {
          $state.go(scope.statePrefix + ".unknown");
        }
      }
      scope.question_index = attrs.index;
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/question-results-directive/question-results-directive.html'
    };
  });
