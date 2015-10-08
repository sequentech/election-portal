/*
 * Review Ballot directive.
 *
 * Shows a list with question and user answers.
 */
angular.module('avBooth')
  .directive('avbReviewBallot', function() {
    return {
      restrict: 'AE',
      templateUrl: 'avBooth/review-ballot-directive/review-ballot-directive.html'
    };
  });