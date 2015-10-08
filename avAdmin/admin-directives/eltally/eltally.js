angular.module('avAdmin')
  .directive('avAdminEltally', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/eltally/eltally.html'
    };
  });
