/*
 * Review screen directive.
 *
 * Shows the steps to the user.
 */
angular.module('avBooth')
  .directive('avbReviewScreen', function() {

    var link = function(scope, element, attrs) {
      // used to display pairwise comparison in a different manner
      _.each(scope.election.questions, function (q) {
        q.isPairWise = _.contains(['pairwise-beta'], q.tally_type);
      });

      scope.audit = function() {
        scope.stateData.auditClicked = true;
        scope.next();
      };
    };
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/review-screen-directive/review-screen-directive.html'
    };
  });