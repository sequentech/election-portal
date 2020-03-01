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

/*
 * Ballot locator screen directive.
 */
angular.module('avElection')
  .directive('avBallotLocatorScreen',  function(ConfigService, $http, $i18next, $sce) {

    function link(scope, element, attrs) {
      scope.locator = attrs.locator;
      scope.locatorStatus = "";
      scope.ballot = "";
      scope.noHeader = (attrs.noHeader !== undefined);
      scope.foundLocator = "";
      scope.searchEnabled = true;
      scope.organization = ConfigService.organization;

      scope.searchLocator = function() {
        scope.searchEnabled = false;
        scope.ballot = "";
        scope.foundLocator = scope.locator;
        scope.locatorStatus = $i18next("avElection.locatorSearchingStatus");
        $http.get(ConfigService.baseUrl + "election/" + scope.election.id + "/hash/" + scope.locator)
          .then(
            function onSuccess(response) {
              scope.searchEnabled = true;
              scope.locatorStatus = $i18next("avElection.locatorFoundStatus");
              scope.ballot = response.data.payload.vote;
            },
            // on error, like parse error or 404
            function onError(response) {
              scope.searchEnabled = true;
              scope.ballot = "";
              scope.locatorStatus = $i18next("avElection.locatorNotFoundStatus");
            }
          );
      };


      if (!scope.noHeader && !scope.election) {
        $http.get(ConfigService.baseUrl + "election/" + scope.electionId)
          .then(function onSuccess(response) {
            scope.election = response.data.payload.configuration;

            if (attrs.locator.length > 0) {
              scope.searchLocator();       
            }
          });
      }
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/ballot-locator-screen-directive/ballot-locator-screen-directive.html'
    };
  });
