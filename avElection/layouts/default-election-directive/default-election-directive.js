/**
 * Public lading page for an election
 */
angular.module('avElection')
  .directive('aveDefaultElection', function($state, $stateParams, $i18next, $location, ConfigService) {
    function link(scope, element, attrs) {
      scope.getShareLink = function() {
        if (!scope.election) {
          return "";
        }

        var text = scope.election.presentation.share_text;
        if (!text || text.length === 0) {
          var title = scope.election.title.substr(0, 40);
          if (title.length > 40) {
            title += "..";
          }
          text = $i18next(
            "avElection.defaultShareText",
            {
              title: title,
              url: $location.absUrl(),
              handle: ConfigService.social.twitterHandle
            });
        }

        return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&source=webclient";
      };
      scope.name = function () {
        return $state.current.name.replace("election.public.show.", "");
      };

      scope.pageName = function() {
        return $stateParams.name;
      };
      
      scope.checkState = function (validStates) {
        return _.contains(validStates, scope.electionState);
      };
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/default-election-directive/default-election-directive.html'
    };
  });
