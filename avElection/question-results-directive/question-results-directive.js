/**
 * This file is part of agora-gui-elections.
 * Copyright (C) 2015-2016  Agora Voting SL <agora@agoravoting.com>

 * agora-gui-elections is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License.

 * agora-gui-elections  is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with agora-gui-elections.  If not, see <http://www.gnu.org/licenses/>.
**/

/**
 * Shows the results of a specific question in an election
 */
angular.module('avElection')
  .directive('avQuestionResults', function($state) {
    // works like a controller
    function link(scope, element, attrs) {
      var mappings = {
        "plurality-at-large": "plurality-at-large",
        "cumulative": "borda",
        "borda-nauru": "borda",
        "borda": "borda",
        "pairwise-beta": "borda",
        "desborda3": "borda",
        "desborda2": "borda",
        "desborda": "borda"
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
