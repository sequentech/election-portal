angular.module('avAdmin')
  .directive('avColumnFilterDatetime', function() {
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

        var minStr = (!scope.filter.min) ? "" : scope.filter.min.toISOString();
        var maxStr = (!scope.filter.max) ? "" : scope.filter.max.toISOString();

        setkey(scope.filterOptionsVar, scope.filterPrefix + "__sort", scope.filter.sort);
        setkey(scope.filterOptionsVar, scope.filterPrefix + "__gt", minStr);
        setkey(scope.filterOptionsVar, scope.filterPrefix + "__lt", maxStr);
      }, true);
    }

    return {
      restrict: 'AE',
      link: link,
      scope: {
        filterOptionsVar: '='
      },
      templateUrl: 'avAdmin/admin-directives/column-filters/datetime/column-filter-datetime.html'
    };
  });
