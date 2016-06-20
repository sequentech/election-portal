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



