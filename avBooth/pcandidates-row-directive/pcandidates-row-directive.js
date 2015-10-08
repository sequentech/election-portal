/*
 * Directive that shows a draft option.
 */
angular.module('avBooth')
  .directive('avbPcandidatesRow', function() {
    return {
      restrict: 'AE',
      templateUrl: 'avBooth/pcandidates-row-directive/pcandidates-row-directive.html'
    };
  });