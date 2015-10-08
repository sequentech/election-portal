angular.module('avAdmin').controller('AdminSignUpController',
  function($scope, $stateParams, $filter, ConfigService, $i18next) {
    $scope.event_id = ConfigService.freeAuthId;
  }
);
