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
 * Shows the results of an election in a simple way
 */
angular.module('avElection')
  .directive('avePublicView', function($stateParams, $window, $http, ConfigService, $i18next, EndsWithService) {
    function link(scope, element, attrs) {
      scope.fileDataHtml = null;
      scope.fileDataError = false;

      if (EndsWithService(scope.pageName(), ".pdf")) {
        scope.getNewElection = function () {
          $window.location.href = ConfigService.publicURL + scope.pageName();
        };
      } else {
        scope.getNewElection = function () {
          $http.get(ConfigService.publicURL + scope.pageName())
            .success(function(value) {
              scope.fileDataHtml = value;
            })
            .error(function(value) {
              scope.fileDataError = true;
            });
        };
      }

      scope.$watch('election', function (newval, oldval) {
        if (newval) {
          scope.getNewElection();
        }
      });
    }
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avElection/layouts/public-view-directive/public-view-directive.html'
    };
  });
