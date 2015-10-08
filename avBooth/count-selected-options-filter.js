/*
 * Count selected options filter.
 */
angular.module('avBooth')
  .filter('avbCountSelectedOptions', function() {
    return function(optionList) {
      return _.filter(optionList, function (option) {
          return option.selected > -1 || option.isSelected === true;
      }).length;
    };
  });