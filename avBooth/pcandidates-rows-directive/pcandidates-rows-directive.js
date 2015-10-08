/*
 * Podemos Candidates Rows directive.
 *
 * Lists the available rows (teams) in an election, filtered.
 */
angular.module('avBooth')
  .directive('avbPcandidatesRows', function() {
    return {
      restrict: 'AE',
      templateUrl: 'avBooth/pcandidates-rows-directive/pcandidates-rows-directive.html'
    };
  });