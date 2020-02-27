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
 * Shows the results of an election. Controls mainly the changing inner states
 * loading config, showing results, showing error if no result is found.
 */
angular.module('avElection').controller('ResultsController',
  function($state, $stateParams, $http, $scope, $i18next, ConfigService, InsideIframeService) {
    $state.go('election.results.loading');

    // get election config and check if they contain the results
    // TODO: change config to results
    $http.get(ConfigService.baseUrl + "election/" + $stateParams.id)
      .then(
        function onSuccess(response) {
          if (response.data.payload.state !== "results_pub") {
            $state.go("election.results.error");
          }
          $scope.election = response.data.payload.configuration;
          $scope.electionState = response.data.payload.state;
          $scope.results = angular.fromJson(response.data.payload.results);
          $scope.statePrefix = "election.results.show";
          $scope.inside_iframe = InsideIframeService();
          $state.go($scope.statePrefix);
        },
        // on error, like parse error or 404
        function onError(response) {
          $state.go("election.results.error");
        }
      );
  }
);
