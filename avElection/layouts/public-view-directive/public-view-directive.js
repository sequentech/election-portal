/**
 * Shows the results of an election in a simple way
 */
angular.module('avElection')
  .directive('avePublicView', function($stateParams, $window, $http, ConfigService, $i18next, EndsWithService) {
    function link(scope, element, attrs) {
      scope.fileDataHtml = null;
      scope.fileDataError = false;

      if (EndsWithService(scope.pageName(), ".pdf")) {
        scope.getNewElection = function () {
          $window.location.href = ConfigService.publicURL + scope.pageName();
        };
      } else {
        scope.getNewElection = function () {
          $http.get(ConfigService.publicURL + scope.pageName())
            .success(function(value) {
              scope.fileDataHtml = value;
            })
            .error(function(value) {
              scope.fileDataError = true;
            });
        };
      }

      scope.$watch('election', function (newval, oldval) {
        if (newval) {
          scope.getNewElection();
        }
      });
    }
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avElection/layouts/public-view-directive/public-view-directive.html'
    };
  });
