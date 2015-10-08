angular.module('avAdmin')
  .directive('avAdminFoot', function(ConfigService) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
      scope.contact = ConfigService.contact;
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-foot-directive/admin-foot-directive.html'
    };
  });
