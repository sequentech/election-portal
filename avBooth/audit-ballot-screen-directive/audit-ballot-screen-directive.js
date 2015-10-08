/*
 * Audit ballot screen directive.
 *
 * Shows the auditable ballot to the user and explains how to audit it.
 */
angular.module('avBooth')
  .directive('avbAuditBallotScreen', function(DeterministicJsonStringifyService) {
    var link = function(scope, element, attrs) {
      scope.auditableBallotStr = DeterministicJsonStringifyService(
        scope.stateData.auditableBallot);

      scope.selectDiv = function (event) {
        // copied from https://code.google.com/p/marinemap/source/browse/media/common/js/jquery/jquery.selText.js?spec=svn1ba72406afc078e007c701b29923a962b5867cc1&r=bf89d8ebf3d34b7185dac20e7064886a8021edf5
        var obj = $(event.target)[0];
        var range = null;
        var selection = null;
        if (/*@cc_on!@*/false) { // ie
            range = obj.offsetParent.createTextRange();
            range.moveToElementText(obj);
            range.select();
        } else if ('MozBoxSizing' in document.body.style || window.opera) { // FF or opera
            selection = obj.ownerDocument.defaultView.getSelection();
            range = obj.ownerDocument.createRange();
            range.selectNodeContents(obj);
            selection.removeAllRanges();
            selection.addRange(range);
        } else { // chrome
            selection = obj.ownerDocument.defaultView.getSelection();
            selection.setBaseAndExtent(obj, 0, obj, 1);
        }
      };
    };
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/audit-ballot-screen-directive/audit-ballot-screen-directive.html'
    };
  });