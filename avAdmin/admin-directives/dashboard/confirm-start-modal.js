angular.module('avAdmin')
  .controller('ConfirmStartModal',
    function($scope, $modalInstance) {
      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    });
