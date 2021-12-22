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
 * Shows election links, highlighting the one selected
 */
angular.module('avElection')
  .directive('aveElectionLinks',
  function(Plugins) {
    function link(scope, element, attrs) {
      var hookData = {
        tabs: []
      };
      Plugins.hook('elections-links', hookData);
      scope.tabs = hookData.tabs;
      scope.shouldEnableElectionLinks = function () {
        return (
          scope.name().indexOf('login') === -1 &&
          scope.name().indexOf('register') === -1 &&
          (
            !scope.election ||
            !scope.election.presentation ||
            !scope.election.presentation.extra_options ||
            !scope.election.presentation.extra_options.disable__public_home
          )
        );
      };
    }

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avElection/layouts/election-links-directive/election-links-directive.html'
    };
  });
