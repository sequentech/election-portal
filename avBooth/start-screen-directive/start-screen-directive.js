/*
 * Start screen directive.
 *
 * Shows the steps to the user.
 */
angular.module('avBooth')
  .directive('avbStartScreen',  function(ConfigService) {

    function link(scope, element, attrs) {
        scope.tosTitle = ConfigService.tos.title;
        scope.tosText = ConfigService.tos.text;
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avBooth/start-screen-directive/start-screen-directive.html'
    };
  });