/*
 * Ballot locator screen directive.
 */
angular.module('avElection')
  .directive('avBallotLocatorScreen',  function(ConfigService, $http, $i18next, $sce) {

    function link(scope, element, attrs) {
      scope.locator = "";
      scope.locatorStatus = "";
      scope.ballot = "";
      scope.noHeader = (attrs.noHeader !== undefined);
      scope.foundLocator = "";
      scope.searchEnabled = true;

      if (!scope.noHeader && !scope.election) {
        $http.get(ConfigService.baseUrl + "election/" + scope.electionId)
          // on success
          .success(function(value) {
            scope.election = value.payload.configuration;
          });
      }

      scope.searchLocator = function() {
        scope.searchEnabled = false;
        scope.ballot = "";
        scope.foundLocator = scope.locator;
        scope.locatorStatus = $i18next("avElection.locatorSearchingStatus");
        $http.get(ConfigService.baseUrl + "election/" + scope.election.id + "/hash/" + scope.locator)
          // on success
          .success(function(value) {
            scope.searchEnabled = true;
            scope.locatorStatus = $i18next("avElection.locatorFoundStatus");
            scope.ballot = value.payload.vote;
          })
          // on error, like parse error or 404
          .error(function (error) {
            scope.searchEnabled = true;
            scope.ballot = "";
            scope.locatorStatus = $i18next("avElection.locatorNotFoundStatus");
          });
      };
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/ballot-locator-screen-directive/ballot-locator-screen-directive.html'
    };
  });
