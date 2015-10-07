angular.module('avElection')
  .directive('aveQuestionInfo', function($state) {
    function link(scope, element, attrs) {
      var mappings = {
        "simple.plurality-at-large": "simple",
        "simple.borda-nauru": "simple",
        "simple.borda": "simple",
        "simple.pairwise-beta": "simple",
        "circles.plurality-at-large": "simple",
        "circles.borda": "simple",
        "circles.borda-nauru": "simple",
        "details.plurality-at-large": "simple",
        "details.borda": "simple",
        "details.borda-nauru": "simple"
      };

      scope.question_index = attrs.index;
      if (scope.question.layout === "") {
        scope.question.layout = "simple";
      }
      var key = scope.question.layout + "." + scope.question.tally_type;
      if (key in mappings) {
        $state.go("election.public.show.home." + mappings[key]);
      } else {
        $state.go("election.public.show.home.simple");
      }
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/question-info-directive/question-info-directive.html'
    };
  });



