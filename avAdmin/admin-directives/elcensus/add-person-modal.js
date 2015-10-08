angular.module('avAdmin')
  .controller('AddPersonModal',
    function($scope, $modalInstance, election, newcensus) {
      $scope.election = election;
      $scope.newcensus = newcensus;
      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    });
