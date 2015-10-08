angular.module('avAdmin')
  .directive('avAdminSidebar', ['$cookies', function($cookies) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var admin = $cookies.user;
        scope.admin = admin;
        scope.active = attrs.active;
    }

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avAdmin/admin-sidebar-directive/admin-sidebar-directive.html'
    };
  }]);
