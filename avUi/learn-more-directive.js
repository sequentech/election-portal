angular.module('avUi')
  .directive('learnMore', function() {

    function link(scope, el, attrs) {
      $(el).attr('href', 'https://bit.ly/avguiadeuso');
    }

    return {
      restrict: 'EAC',
      link: link
    };
  });
