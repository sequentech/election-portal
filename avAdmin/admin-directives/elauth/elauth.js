angular.module('avAdmin')
  .directive('avAdminElauth', ['ElectionsApi', function(ElectionsApi) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.election = ElectionsApi.currentElection;
        scope.auth = ['email', 'sms'];
        //scope.auth = ['email', 'sms', 'dnie'];
        scope.electionEditable = function() {
          return !scope.election.id || scope.election.status === "registered";
        };
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elauth/elauth.html'
    };
  }]);
