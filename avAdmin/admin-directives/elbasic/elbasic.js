angular.module('avAdmin')
  .directive('avAdminElbasic', ['$state', 'ElectionsApi', function($state, ElectionsApi) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.election = ElectionsApi.currentElection;
        scope.layouts = ['simple', /*'2questions-conditional', 'pcandidates-election'*/];
        scope.themes = ['default'/*, 'podemos'*/];

        scope.electionEditable = function() {
          return !scope.election.id || scope.election.status === "registered";
        };

        function save() {
            $state.go("admin.questions");
        }

        angular.extend(scope, {
          saveBasic: save,
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elbasic/elbasic.html'
    };
  }]);
