angular.module('avAdmin')
  .directive('avAdminElections', ['Authmethod', 'ElectionsApi', '$state', function(Authmethod, ElectionsApi, $state) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.page = 1;
        scope.loading = false;
        scope.nomore = false;
        scope.elections = [];

        function loadMoreElections() {
            if (scope.loading || scope.nomore) {
                return;
            }
            scope.loading = true;

            function getAllElections(list) {
                list.forEach(function (perm) {
                    ElectionsApi.getElection(perm.object_id)
                        .then(function(d) {
                            scope.elections.push(d);
                            scope.loading -= 1;
                        })
                        .catch(function(d) {
                            // election doesn't exists in agora-elections
                            console.log("Not in agora elections: " + perm.object_id);
                            scope.loading -= 1;
                        });
                });
            }

            Authmethod.electionsIds(scope.page)
                .success(function(data) {
                    scope.page += 1;

                    if (data.end_index === data.total_count) {
                        scope.nomore = true;
                    }

                    // here we've the elections id, then we need to ask to
                    // ElectionsApi for each election and load it.
                    scope.loading = data.perms.length;
                    getAllElections(data.perms);
                })
                .error(function(data) {
                    scope.loading = false;
                    scope.error = data;
                });
        }

        angular.extend(scope, {
          loadMoreElections: loadMoreElections,
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elections/elections.html'
    };
  }]);
