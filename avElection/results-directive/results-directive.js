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

        // generate share links
        var shortedTitle = scope.election.title;
        if (shortedTitle.length > 64) {
          shortedTitle = shortedTitle.substr(0, 64) + "..";
        }
        var shareText = $i18next("avElection.resultsHeader", {title: scope.election.title}) + " " + $location.absUrl();
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
