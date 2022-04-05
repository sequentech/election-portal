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

/*
 * Ballot locator screen directive.
 */
angular.module('avElection')
  .directive('avVerifyResults',  function(ConfigService, $stateParams) {

    function link(scope, element, attrs) {
      scope.publicURL = ConfigService.publicURL;
      scope.verifier = ConfigService.verifier;
      scope.noHeader = (attrs.noHeader !== undefined);
      scope.electionId = $stateParams.id;
      scope.organization = ConfigService.organization;
    }

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avElection/verify-results-directive/verify-results-directive.html'
    };
  });
