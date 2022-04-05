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

angular.module('avElection')
  .directive('aveQuestionInfo', function($state) {
    function link(scope, element, attrs) {
      var mappings = {
        "simple.plurality-at-large": "simple",
        "simple.borda-nauru": "simple",
        "simple.borda": "simple",
        "simple.pairwise-beta": "simple",
        "simple.desborda3": "simple",
        "simple.desborda2": "simple",
        "simple.desborda": "simple",
        "simple.borda-mas-madrid": "simple",
        "circles.plurality-at-large": "simple",
        "circles.borda": "simple",
        "circles.borda-nauru": "simple",
        "circles.desborda3": "simple",
        "circles.desborda2": "simple",
        "circles.desborda": "simple",
        "circles.borda-mas-madrid": "simple",
        "details.plurality-at-large": "simple",
        "details.borda": "simple",
        "details.borda-mas-madrid": "simple",
        "details.borda-nauru": "simple",
        "details.desborda3": "simple",
        "details.desborda2": "simple",
        "details.desborda": "simple"
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



