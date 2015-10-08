angular.module('avAdmin')
  .controller('AddCsvModal',
    function($scope, $modalInstance, election) {
      $scope.election = election;
      $scope.textarea = "";
      $scope.ok = function () {
        $modalInstance.close($("#csv-textarea").val());
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    });
