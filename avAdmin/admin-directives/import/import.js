angular.module('avAdmin')
  .directive('avAdminImport', function($window, ElectionsApi, $state, ImportService, $upload) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.loading = false;
        scope.filesDrop = null;
        scope.parsed = null;

        function selectFile() {
          document.querySelector("#importfile").click();
        }

        function uploadFile(element) {
          scope.loading = true;

          var f = element.files[0];
          scope.$apply(function() {
            scope.file = f;
          });
          retrieveFile(f);
        }

        function retrieveFile(f) {
          console.log("retrieveFile");
          $window.Papa.parse(f, {
            complete: function(results) {
              console.log("retrieveFile complete");
              scope.loading = false;
              var els = ImportService(results.data);
              // only works for one election, the first
              ElectionsApi.currentElections = els;
              ElectionsApi.setCurrent(els[0]);
              ElectionsApi.newElection = true;
              $state.go("admin.create");
            },
          });
        }

        scope.$watch('filesDrop', function () {
          console.log("watch filesDrop");
          if (!!scope.filesDrop && scope.filesDrop.length > 0) {
            console.log("watch filesDrop enter");
            retrieveFile(scope.filesDrop[0]);
          }
        });

        angular.extend(scope, {
          selectFile: selectFile,
          uploadFile: uploadFile
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/import/import.html'
    };
  });
