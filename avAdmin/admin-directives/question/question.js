angular.module('avAdmin')
  .directive('avAdminQuestion', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
      scope.layouts = [
        "circles",
        "accordion",
        /*"conditional-accordion",
        "ahoram-primaries"*/
      ];
      scope.edittingIndex = -1;
      scope.internal = {};
      scope.questionIndex = function() {
        return scope.$index;
      };

      // validators
      scope.validateMaxNumOptions = function(value) {
        return parseInt(value) <= scope.q.answers.length;
      };

      scope.validateMinMax = function(value) {
        return parseInt(value) <= scope.q.max;
      };

      function scrollToCurrent() {
        setTimeout(function() {
          $("html,body").animate({scrollTop: $(element).offset().top - 250}, 400);
        }, 200);
      }

      // scroll and show on creation
      if (scope.q.active) {
        scrollToCurrent();
      }

      scope.$watch("q.active", function (newValue, oldValue) {
        if (newValue === true) {
          scrollToCurrent();
        }
      });

      // When an answer has been drag-and-drop, we have to update the indexes
      scope.recalculateAnswerIds = function(item, newPos) {
        // we do it a-posteriori, because the list has not been updated yet when
        // this call happens, but it will
        setTimeout(function() {
          _.each(scope.q.answers, function(answer, index) {
            answer.id = answer.sort_order = index;
          });
        }, 200);
        return item;
      };
    }

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avAdmin/admin-directives/question/question.html'
    };
  });
