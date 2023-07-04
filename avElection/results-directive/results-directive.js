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
 * Shows the results of an election
 */
angular.module('avElection')
  .directive('avResults', function(moment, ConfigService, $stateParams, $location, $i18next) {
    // works like a controller
    function link(scope, element, attrs) {

      /*
       * Parses and initializes the election data
       */
      function initData() {
        scope.last_updated = moment(scope.election.last_updated).format('lll');
        scope.electionDataUrl = ConfigService.baseUrl + "election/" + $stateParams.id;
        scope.noHeader = (attrs.noHeader !== undefined);
        scope.rotateQuestions = false;
        scope.rotateQuestionsTimer = null;
        scope.currentQuestion = 0;

        function rotateQuestions()
        {
          if (!scope.rotateQuestions || !scope.election) 
          {
            if (scope.rotateQuestionsTimer)
            {
              clearTimeout(scope.rotateQuestionsTimer);
            }
            scope.rotateQuestionsTimer = null;
            return;
          }

          scope.currentQuestion = (scope.currentQuestion + 1) % scope.election.questions.length;
          scope.rotateQuestionsTimer = setTimeout(rotateQuestions, 8000);
          // trigger a redraw
          scope.$apply();
        }

        scope.toggleRotateQuestions = function () 
        {
          scope.rotateQuestions = !scope.rotateQuestions;
          scope.currentQuestion = -1;
          rotateQuestions();
        };

        // generate share links
        var lang = window.i18n.lng();
        var shortedTitle = scope.election.title_i18 && scope.election.title_i18[lang] || scope.election.title;
        if (shortedTitle.length > 64) {
          shortedTitle = shortedTitle.substr(0, 64) + "..";
        }
        var shareText = $i18next("avElection.resultsHeader", {title: shortedTitle}) + " " + $location.absUrl();
        scope.electionTwitterUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareText);
        scope.electionFacebookUrl = "https://twitter.com/home?status=" + encodeURIComponent(shareText);

      }
      initData();
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/results-directive/results-directive.html'
    };
  });
