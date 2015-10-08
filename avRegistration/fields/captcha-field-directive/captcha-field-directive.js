angular.module('avRegistration')
  .directive('avrCaptchaField', ['Authmethod', '$state', '$interval', function(Authmethod, $state, $interval) {
    function link(scope, element, attrs) {
        var timeoutId = null;

        scope.authMethod = Authmethod;
        Authmethod.newCaptcha("");
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avRegistration/fields/captcha-field-directive/captcha-field-directive.html'
    };
  }]);
