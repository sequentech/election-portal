/*
 * Ballot locator screen directive.
 */
angular.module('avBooth')
  .directive('avVerifyResults',  function(ConfigService, $stateParams) {

    function link(scope, element, attrs) {
      scope.publicURL = ConfigService.publicURL;
      scope.verifier = ConfigService.verifier;
      scope.noHeader = (attrs.noHeader !== undefined);
      scope.electionId = $stateParams.id;
    }

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avElection/verify-results-directive/verify-results-directive.html'
    };
  });