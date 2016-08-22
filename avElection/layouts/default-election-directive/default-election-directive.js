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
 * Public lading page for an election
 */
angular.module('avElection')
  .directive('aveDefaultElection', function($state, $stateParams, $i18next, $location, ConfigService) {
    function link(scope, element, attrs) {
      scope.organization = ConfigService.organization;

      scope.getSocialLink = function (network, message) {
        var ret ='';
        if('Facebook' === network) {
          ret = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(message);
        } else if('Twitter' === network) {
          ret = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(message) + '&source=webclient';
        }
        return ret;
      };

      scope.getSocialImg = function (network) {
        var ret ='';
        if('Facebook' === network) {
          ret = '/election/img/facebook_logo_50.png';
        } else if('Twitter' === network) {
          ret = '/election/img/twitter_logo_48.png';
        }
        return ret;
      };

      scope.name = function () {
        return $state.current.name.replace("election.public.show.", "");
      };

      scope.pageName = function() {
        return $stateParams.name;
      };

      scope.checkState = function (validStates) {
        return _.contains(validStates, scope.electionState);
      };
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/default-election-directive/default-election-directive.html'
    };
  });
