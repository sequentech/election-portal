angular.module('avAdmin')
  .directive('avAdminElcensusConfig', function($window, $state, ElectionsApi, MustExtraFieldsService) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.census = ['open', 'close'];
        scope.election = ElectionsApi.currentElection;
        scope.electionEditable = function() {
          return !scope.election.id || scope.election.status === "registered";
        };
        scope.newef = {};
        scope.newcensus = {};
        scope.extra_fields = {editing: null};
        scope.massiveef = "";
        scope.loadingcensus = !ElectionsApi.newElection;

        function addEf() {
            var el = ElectionsApi.currentElection;
            var efs = el.census.extra_fields;

            var ef = {
                name: scope.newef.name,
                type: "text",
                required: scope.newef.required,
                min: 2,
                max: 200,
                private: false,
                required_on_authentication: false,
                must: false,
                "register-pipeline": []
            };

            scope.extra_fields.editing = ef;

            scope.newef = {};
            efs.unshift(ef);
        }

        angular.extend(scope, {
            addEf: addEf
        });

        function main() {
            scope.election = ElectionsApi.currentElection;
            MustExtraFieldsService(scope.election);
        }

        ElectionsApi.waitForCurrent(main);
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elcensus-config/elcensus-config.html'
    };
  });
