/*
 * Show the authorities of an election directive.
 */
angular.module('avElection')
  .directive('aveAuthorities',  function(ConfigService, $http) {

    function link(scope, element, attrs) {
        scope.authorities = null;
        scope.allAuths = null;
        scope.auths = [];
        scope.state = 'loading';

        scope.updateAuths = function () {
          var election = scope.election;
          if (!election || !scope.allAuths) {
            scope.auths = [];
            return;
          }

          var authorities = angular.copy(election.authorities);
          authorities.push(election.director);

          scope.auths = _.shuffle(
            _.map(authorities, function (name) {
              return scope.allAuths[name];
            }));
        };

        // get election config
        $http.get(ConfigService.electionsAPI + "authorities")
          .success(function(value) {
            scope.allAuths = value.payload;
            scope.state = 'loaded';
          })
          // on error, like parse error or 404
          .error(function (error) {
            scope.state = "error";
          });

        scope.$watch("election", function (newValue, oldValue) {
          console.log("newelection");
          scope.updateAuths();
        });
        scope.$watch("allAuths", function (newValue, oldValue) {
          console.log("got all auths");
          scope.updateAuths();
        });
    }

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avElection/authorities-directive/authorities-directive.html'
    };
  });
