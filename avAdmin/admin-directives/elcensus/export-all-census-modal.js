angular.module('avAdmin')
  .controller('ExportAllCensusModal',
    function($scope, $modalInstance, ElectionsApi, election) {
      $scope.election = angular.copy(election);
      $scope.totalCensusCount = $scope.election.data.total_count;
      $scope.election.census.voters = [];
      $scope.currentCount = 0; // start from zero as we use a different page size
      $scope.nomore = false;
      $scope.page = 1;
      $scope.downloading = false;
      $scope.error = false;

      $scope.loadMoreCensus = function () {
        if ($scope.nomore) {
          $modalInstance.close($scope.election);
          return;
        }

        if ($scope.downloading) {
          return;
        }
        $scope.downloading = true;

        ElectionsApi.getCensus($scope.election, $scope.page, "max")
          .then(function(el) {
            $scope.page += 1;

            $scope.totalCensusCount = el.data.total_count;
            $scope.currentCount = el.data.end_index;
            if (el.data.end_index === el.data.total_count) {
              $scope.downloading = false;
              $scope.nomore = true;
              $modalInstance.close($scope.election);
              return;
            }

            $scope.downloading = false;
            $scope.loadMoreCensus();
          })
          .catch(function(data) {
            $scope.error = data;
            $scope.downloading = false;
          });
      };

      $scope.ok = function () {
        $scope.error = false;
        $scope.loadMoreCensus();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    });
