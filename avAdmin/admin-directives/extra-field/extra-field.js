angular.module('avAdmin')
  .directive('avExtraField', function() {
    function link(scope, element, attrs) {
      scope.field.disabled = true;

      scope.toggleEdit = function() {
        if (scope.extra_fields.editing === scope.field) {
          scope.extra_fields.editing = null;
        } else {
          scope.extra_fields.editing = scope.field;
        }
      };

      scope.beingEdited = function() {
        return scope.extra_fields.editing === scope.field;
      };

      scope.incOpt = function (option, inc) {
        if(!scope.field[option]) {
          scope.field[option] = 0;
          return;
        }
        scope.field[option] = parseInt(scope.field[option]) + inc;
      };

      scope.removeField = function() {
        var el = scope.election;
        var ef = el.census.extra_fields;
        var index = ef.indexOf(scope.field);
        el.census.extra_fields = ef.slice(0, index).concat(ef.slice(index+1,ef.length));
      };

      // scroll and show on creation
      if (scope.extra_fields.editing === scope.field) {
        $("html,body").animate({scrollTop: $(element).offset().top - 250}, 400);
      }

      scope.$watch('field.type', function(now, Before) {
        if (scope.field.type === 'dict') {
          scope.field.private = true;
        }
      });
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avAdmin/admin-directives/extra-field/extra-field.html'
    };
  });
