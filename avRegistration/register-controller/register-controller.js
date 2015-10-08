angular.module('avRegistration').controller('RegisterController',
  function($scope, $stateParams, $filter, ConfigService, $i18next) {
    $scope.event_id = $stateParams.id;
    $scope.email = $stateParams.email;
  }
);
