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
  .directive('aveSimpleQuestion', function(AddDotsToIntService, PercentVotesService, $i18next) {
    function link(scope, element, attrs) {
      scope.tallyMethod = $i18next("avCommon.votings." + scope.question.tally_type);

      // group by category
      var categories = _.groupBy(scope.question.answers, "category");
      // convert this associative array to a list of objects with title and
      // options attributes
      scope.categories = _.map(_.pairs(categories), function(pair) {
        var i = -1;
        var title = pair[0];
        var answers = pair[1];

        return {
          title: title,
          options: answers,
          isOpen: (scope.folding_policy === "unfold-all")
        };
      });

      // apply shuffling policy
      if (angular.isDefined(scope.question.extra_options)) {
        if(true === scope.question.extra_options.shuffle_categories) {
          scope.categories = _.shuffle(scope.categories);
        }

        if (true === scope.question.extra_options.shuffle_all_options) {
          scope.categories = _.each( scope.categories, function(category) {
            category.options = _.shuffle(category.options);
          });
        } else if (false === scope.question.extra_options.shuffle_all_options &&
                 angular.isArray(scope.question.extra_options.shuffle_category_list) &&
                 scope.question.extra_options.shuffle_category_list.length > 0) {
          scope.categories = _.each( scope.categories, function(category) {
            if (-1 !== scope.question.extra_options.shuffle_category_list.indexOf(category.title)) {
              category.options = _.shuffle(category.options);
            }
          });
        }
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
