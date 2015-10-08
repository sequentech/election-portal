/**
 * Module used to configure what action will be executed when the user
 * successfully logins/registers into the auth event. By default, the action
 * will be to enter the voting booth, but it can be reconfigured to load a
 * specific URL.
 *
 * @author Eduardo Robles Elvira <edulix AT agoravoting DOT com>
 */
angular.module('avAdmin')
  .directive(
    'avAdminSuccessAction',
    function(
      $window,
      $state,
      ElectionsApi,
      MustExtraFieldsService)
    {
      function link(scope, element, attrs)
      {
        // set election config from ElectionsApi
        function setScopeElection() {
          scope.election = ElectionsApi.currentElection;
          scope.action = scope.election.census.config['authentication-action'];
        }
        setScopeElection();

        scope.electionEditable = function() {
          return !scope.election.id;
        };

        // if the election is not loaded yet, then once it's loaded, update the
        // election scope variable
        ElectionsApi.waitForCurrent(setScopeElection);
      }

      return {
        restrict: 'AE',
        scope: {},
        link: link,
        templateUrl: 'avAdmin/admin-directives/success-action/success-action.html'
      };
    });
