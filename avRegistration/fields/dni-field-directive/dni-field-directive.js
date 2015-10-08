angular.module('avRegistration')
  .directive('avrDniField', function($state) {
    function link(scope, element, attrs) {
      scope.dni_re = /^[XYZ]?\d{7,8}[A-Z]$/;

      // returns true if regex matches or if there's no regex
      scope.validateDni = function(str) {
         // If no valid value passed
        if (!str) {
          str = '';
        }
        // Ensure upcase and remove whitespace
        str = str.toUpperCase().replace(/\s/, '');

        var prefix = str.charAt(0);
        var index = "XYZ".indexOf(prefix);
        var niePrefix = 0;
        if (index > -1) {
          niePrefix = index;
          str = str.substr(1);
          if (prefix === 'Y') {
              str = "1" + str;
          } else if (prefix === 'Z') {
              str = "2" + str;
          }
        }
        var dni_letters = "TRWAGMYFPDXBNJZSQVHLCKE";
        var letter = dni_letters.charAt( parseInt( str, 10 ) % 23 );
        return letter === str.charAt(str.length - 1);
      };
    }
    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avRegistration/fields/dni-field-directive/dni-field-directive.html'
    };
  });
