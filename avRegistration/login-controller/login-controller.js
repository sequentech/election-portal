angular.module('avRegistration').controller('LoginController',
  function($scope, $stateParams, $filter, ConfigService, $i18next) {
    $scope.event_id = $stateParams.id;
    $scope.code = $stateParams.code;
    $scope.email = $stateParams.email;
  }
);
