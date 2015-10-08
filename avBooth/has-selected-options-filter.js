/*
 * Has selected Options filter.
 */
angular.module('avBooth')
  .filter('avbHasSelectedOptions', function() {
    return function(optionList) {
      return _.filter(optionList, function (option) {
          return option.selected > -1;
      }).length > 0;
    };
  });