/*
 * UnitTestE2EController, that allows E2E unit tests to inject code for testing
 * purposes.
 */

angular.module('avTest')
  .controller('UnitTestE2EController',
    function($scope, $location, ConfigService) {
      if (ConfigService.debug) {
        $scope.html = ($location.search()).html;
        console.log($location.search());
      }
    });
