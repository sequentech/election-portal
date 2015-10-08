angular.module('avAdmin')
  .directive('avColumnFilterInt', function() {
    function link(scope, element, attrs) {
      scope.status = {
        isOpen: false
      };
      scope.filter = {
        sort: '',
        min: '',
        max: ''
      };
      scope.filterPrefix = attrs.filterPrefix;
      scope.filterI18n = attrs.filterI18n;

      function setkey(el, key, val) {
        if (val === '') {
          delete el[key];
        } else {
          el[key] = val;
        }
      }

      scope.$watch('filter', function (newFilter, oldFilter) {
        if (_.isEqual(newFilter, oldFilter)) {
          return;
        }

        setkey(scope.filterOptionsVar, scope.filterPrefix + "__sort", scope.filter.sort);
        setkey(scope.filterOptionsVar, scope.filterPrefix + "__gt", scope.filter.min);
        setkey(scope.filterOptionsVar, scope.filterPrefix + "__lt", scope.filter.max);
      }, true);
    }

    return {
      restrict: 'AE',
      link: link,
      scope: {
        filterOptionsVar: '='
      },
      templateUrl: 'avAdmin/admin-directives/column-filters/int/column-filter-int.html'
    };
  });
