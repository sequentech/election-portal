angular.module('avElection')
  .directive('aveSimpleQuestion', function(AddDotsToIntService, PercentVotesService, $i18next) {
    function link(scope, element, attrs) {
      scope.tallyMethod = $i18next("avAdmin.questions.votings." + scope.question.tally_type);

      if (scope.question.randomize_answer_order) {
          var i = -1;
          var answers = scope.question.answers;
          var shuffledNumbers = _.shuffle(_.map(answers, function () { i += 1; return i;}));
          // map different sort orders
          var shuffledAnswers = _.map(shuffledNumbers, function (index) { return answers[index].sort_order;});
          // now, assign
          _.each(answers, function (opt, index) { opt.sort_order = shuffledAnswers[index];});
          answers.sort(function (item1, item2) { return item1.sort_order - item2.sort_order; });
          scope.question.answers = answers;
      }
      scope.qindex = parseInt(scope.question_index) + 1;
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/simple-question-directive/simple-question-directive.html'
    };
  });
