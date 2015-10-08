/*
 * Error indicator directive.
 */
angular.module('avBooth')
  .directive('avbSuccessScreen', function(ConfigService, $interpolate) {

    function link(scope, element, attrs) {
      var text = $interpolate(ConfigService.success.text);

      scope.tweetLink = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(scope.election.presentation.share_text) + '&source=webclient';
      scope.successText = text({electionId: scope.election.id});
    }

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/success-screen-directive/success-screen-directive.html'
    };
  });
