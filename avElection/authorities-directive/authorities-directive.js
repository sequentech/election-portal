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
 * Show the authorities of an election directive.
 */
angular.module('avElection')
  .directive('aveAuthorities',  function(ConfigService, $http) {

    function link(scope, element, attrs) {
        scope.authorities = null;
        scope.allAuths = null;
        scope.auths = [];
        scope.state = 'loading';

        scope.updateAuths = function () {
          var election = scope.election;
          if (!election || !scope.allAuths) {
            scope.auths = [];
            return;
          }

          var authorities = angular.copy(election.authorities);
          authorities.push(election.director);

          scope.auths = _.shuffle(
            _.map(authorities, function (name) {
              return scope.allAuths[name];
            }));
        };

        // get election config
        $http.get(ConfigService.electionsAPI + "authorities")
          .then(
            function onSuccess(response) {
              scope.allAuths = response.data.payload;
              scope.state = 'loaded';
            },
            // on error, like parse error or 404
            function onError(response) {
              scope.state = "error";
            }
          );

        scope.$watch("election", function (newValue, oldValue) {
          console.log("newelection");
          scope.updateAuths();
        });
        scope.$watch("allAuths", function (newValue, oldValue) {
          console.log("got all auths");
          scope.updateAuths();
        });
    }

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avElection/authorities-directive/authorities-directive.html'
    };
  });
