angular.module('avAdmin').controller('AdminLoginController',
  function($scope, $stateParams, $filter, ConfigService, $i18next) {
    $scope.authId = ConfigService.freeAuthId;
  }
);
