/*
 * Directive that shows a draft option cell.
 */
angular.module('avBooth')
  .directive('avbPcandidatesCell', function($filter) {

    var link = function(scope, element, attrs) {
      scope.question_index = parseInt(attrs.avbPcandidatesCell);
      scope.team = scope.$parent.$parent.team;
      scope.candidates = scope.team.options[scope.question_index];
      scope.candidates.selected = $filter("avbCountSelectedOptions")(scope.candidates);

      scope.question_title = scope.$parent.question.title;

      scope.isOpenCell = function () {
        return scope.team["isOpen" + scope.question_index];
      };

      scope.toggleOpenCell = function () {
        scope.team["isOpen" + scope.question_index] =
          !scope.team["isOpen" + scope.question_index];
      };

      scope.getUrl = function(candidate, title) {
        return _.filter(candidate.urls, function (url) {
          return url.title === title;
        })[0];
      };
    };

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avBooth/pcandidates-cell-directive/pcandidates-cell-directive.html'
    };
  });