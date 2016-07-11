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
 * Shows the public view of an election. Controls mainly the changing inner states
 * loading config, showing results, showing error if needed.
 */
angular.module('avElection').controller('PublicController',
  function($state, $stateParams, $http, $scope, $i18next, ConfigService, InsideIframeService, Authmethod) {
//     $state.go('election.public.loading');

    var mapLayouts = {
      "": "default",
      "simple": "default",
      "pcandidates-election": "default",
      "2questions-conditional": "default",
      "conditional-accordion": "default",
      "ahoram-primaries": "default"
    };
    $("#theme").attr("href", "election/themes/" + ConfigService.theme + "/app.min.css");
    //window.avThemes.change(ConfigService.theme);
    $scope.layout = mapLayouts["simple"];
    $scope.statePrefix = "election.public.show.home";
        $scope.inside_iframe = InsideIframeService();
    $scope.documentation = ConfigService.documentation;
    $scope.documentation.security_contact = ConfigService.legal.security_contact;
    $scope.documentation_html_include = ConfigService.documentation_html_include;
    $scope.legal_html_include = ConfigService.legal_html_include;

    // get election config
    var extra_data  = {};
    $http.get(ConfigService.authAPI + "legal/" + $stateParams.id)
      .then(function(value) {
        if(value.data) {
          extra_data = value.data;
        }
        return $http.get(ConfigService.baseUrl + "election/" + $stateParams.id);
      })
      .then(function(value) {
        $scope.election = value.data.payload.configuration;
        $scope.election.extra_data = extra_data;
        $scope.layout = mapLayouts[$scope.election.layout];
        $scope.electionState = value.data.payload.state;
        $scope.results = angular.fromJson(value.data.payload.results);
      })
      // on error, like parse error or 404
      .catch(function (error) {
        $state.go("election.public.error");
      });

    Authmethod.viewEvent($stateParams.id)
      .success(function(data) {
        if (data.status === "ok") {
          $scope.authEvent = data.events;
        }
      });
  }
);
