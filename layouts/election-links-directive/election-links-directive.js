/**
 * Shows election links, highlighting the one selected
 */
angular.module('avElection')
  .directive('aveElectionLinks', function() {
    return {
      restrict: 'AE',
      templateUrl: 'avElection/layouts/election-links-directive/election-links-directive.html'
    };
  });
