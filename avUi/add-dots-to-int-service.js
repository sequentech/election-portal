/*
 * Given a number, adds dots every three digits.
 *
 * Example:
 *
 *    AddDotsToIntService(1234567) --> "1.234.567"
 *    AddDotsToIntService(1111.234567) --> "1.111,234567"
 */
angular.module('avUi')
  .service('AddDotsToIntService', function() {
    return function (number, fixedDigits) {
      if (angular.isNumber(fixedDigits) && fixedDigits >= 0) {
        number = number.toFixed(parseInt(fixedDigits));
      }
      var number_str = (number + "").replace(".", ",");
      var ret = "";
      var commaPos = number_str.length;
      if (number_str.indexOf(",") !== -1) {
        commaPos = number_str.indexOf(",");
      }
      for (var i = 0; i < commaPos; i++) {
        var reverse = commaPos - i;
        if ((reverse % 3 === 0) && reverse > 0 && i > 0) {
          ret = ret + ".";
        }
        ret = ret + number_str[i];
      }
      return ret + number_str.substr(commaPos, number_str.length);
    };
  });
