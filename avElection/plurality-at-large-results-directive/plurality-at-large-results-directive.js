/**
 * This file is part of election-portal.
 * Copyright (C) 2015-2016  Sequent Tech Inc <legal@sequentech.io>

 * election-portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License.

 * election-portal  is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with election-portal.  If not, see <http://www.gnu.org/licenses/>.
**/

/**
 * Shows the results of a specific question in an election, when the question
 * is of show with the plurality at large layout
 */
angular.module('avElection')
  .directive('avPluralityAtLargeResults', function(AddDotsToIntService, PercentVotesService, $sce) {
    // works like a controller
    function link(scope, element, attrs) {

      /*
       * Parses and initializes the election data
       */
      function initData() {
        // copy questions before sort
        scope.question = angular.copy(scope.question);
        scope.question.descriptionHtml = $sce.trustAsHtml('<p>' + scope.question.description + '</p>');
          _.each(scope.question.answers, function (answer) {
            answer.is_winner = (answer.winner_position !== null);
          });
        scope.question.answers.sort(function(answer, answer2) {
          // if one is a winner, then that one goes first
          if (answer.is_winner && !answer2.is_winner) {
            return -1;
          } else if (!answer.is_winner && answer2.is_winner) {
            return 1;
          } else if (answer.is_winner && answer2.is_winner) {
            // if both are winners, then try sort by winner position
            var winDiff = answer.winner_position - answer2.winner_position;
            if (winDiff !== 0) {
              return winDiff;
            }
          }

          // if they have the same position, sort by totals
          return answer2.total_count - answer.total_count;
        });
      }
      initData();

      scope.addDotsToIntNumber = AddDotsToIntService;
      scope.numVotes = function (votes) {
        return AddDotsToIntService(votes);
      };
      scope.percentVotes = PercentVotesService;

      /*
       * Returns the winner position if its >= 0. Else, returns ""
       */
      scope.winnerPosition = function(answer) {
        if (answer.winner_position !== null && answer.winner_position >= 0) {
          return answer.winner_position + 1;
        } else {
          return "";
        }
      };
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/plurality-at-large-results-directive/plurality-at-large-results-directive.html'
    };
  });
