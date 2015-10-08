/*
 * Encrypt Ballot Screen directive.
 *
 * Shown while the ballot is being encrypted and sent.
 */
angular.module('avBooth')
  .directive('avbEncryptingBallotScreen', function($i18next, EncryptBallotService, $timeout, $window) {

    function link(scope, element, attrs) {
      // moves the title on top of the busy indicator
      scope.updateTitle = function(title) {
        var titleEl = element.find(".avb-busy-title").html(title);

        // set margin-top
        var marginTop = - titleEl.height() - 45;
        var marginLeft = - titleEl.width()/2;
        titleEl.attr("style", "margin-top: " + marginTop + "px; margin-left: " + marginLeft + "px");
      };

      // function that receives updates from the cast ballot service and shows
      // them to the user
      function statusUpdateFunc(status, options) {
        if (status === "sanityChecks") {
          scope.updateTitle($i18next(
            "avBooth.statusExecutingSanityChecks",
            {
              percentage: options.percentageCompleted
            }));
          scope.percentCompleted = options.percentageCompleted;

        } else if (status === "encryptingQuestion") {
          scope.updateTitle($i18next(
            "avBooth.statusEncryptingQuestion",
            {
              questionNum: options.questionNum + 1,
              percentage: options.percentageCompleted
            }));
          scope.percentCompleted = options.percentageCompleted;

        } else if (status === "verifyingQuestion") {
          scope.updateTitle($i18next(
            "avBooth.statusVerifyingQuestion",
            {
              questionNum: options.questionNum + 1,
              percentage: options.percentageCompleted
            }));
          scope.percentCompleted = options.percentageCompleted;
        }
      }
      // delay in millisecs
      var delay = 500;

      function encryptBallot() {
        var encryptionInfo = {
          election: scope.election,
          pubkeys: scope.pubkeys,
          statusUpdate: statusUpdateFunc,
          authorizationHeader: scope.authorizationHeader,

          // on success, we first then try to submit, then once submitted we
          // show the next screen (which is the success-screen directive)
          success: function(encryptedBallot, auditableBallot) {
            scope.updateTitle($i18next("avBooth.sendingBallot", {percentage: 80}));
            scope.percentCompleted = 80;
            scope.stateData.auditableBallot = auditableBallot;
            scope.stateData.encryptedBallot = encryptedBallot;
            scope.next();
          },

          // on error, try to deal with it
          error: function (status, message) {
            if (status === "errorEncrypting") {
              scope.showError($i18next("avBooth.errorEncrypting",
                {msg:message}));
            } else if (status === "errorEncoding") {
              scope.showError($i18next("avBooth.errorEncoding",
                {msg:message}));
            } else if (status === "sanityChecksFailed") {
              scope.showError($i18next("avBooth.sanityChecksFailed",
                {msg:message}));
            } else {
              scope.showError($i18next("avBooth.errorEncryptingBallotUnknown",
                {msg:message}));
            }
          },
          verify: false,
          delay: delay
        };
        EncryptBallotService(encryptionInfo);
      }

      $timeout(function () {
        encryptBallot();
      }, delay);
    }

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/encrypting-ballot-screen-directive/encrypting-ballot-screen-directive.html'
    };
  });