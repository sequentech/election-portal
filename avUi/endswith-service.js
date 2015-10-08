angular.module('avUi')
  .service('EndsWithService', function() {
    return function (originString, searchString) {
        if (!angular.isString(originString) || !angular.isString(searchString)) {
          return false;
        }
        var lastIndex = originString.indexOf(searchString);
        return lastIndex !== -1 && lastIndex === originString.length - searchString.length;
      };
    });