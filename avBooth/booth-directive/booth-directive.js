angular.module('avBooth')
  .directive('avBooth', function($http, $location, $i18next, $window, $timeout, HmacService, ConfigService, InsideIframeService) {

    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
      // timeout is used with updateWidth so that we do not create too many
      // calls to it, at most one per 100ms
      var timeoutWidth;
      var w = angular.element($window);
      $("#theme").attr("href", "themes/" + ConfigService.theme + "/app.min.css");

      // when we are not inside an iframe and voter id is not set, this is a
      // demo booth
      scope.isDemo = !InsideIframeService() && !scope.voterId;

      function updateWidth() {
        $timeout.cancel(timeoutWidth);
        timeoutWidth = $timeout(function() {
          scope.windowWidth = w.width();
          console.log("scope.windowWidth = " + scope.windowWidth);
          scope.$apply();
        }, 100);
      }
      w.bind('resize', function () {
        updateWidth();
      });
      updateWidth();

      // possible values of the election state scope variable
      var stateEnum = {
        receivingElection: 'receivingElection',
        errorScreen: 'errorScreen',
        helpScreen: 'helpScreen',
        startScreen: 'startScreen',
        multiQuestion: 'multiQuestion',
        pairwiseBeta: 'pairwiseBeta',
        draftsElectionScreen: 'draftsElectionScreen',
        auditBallotScreen: 'auditBallotScreen',
        pcandidatesElectionScreen: 'pcandidatesElectionScreen',
        "2questionsConditionalScreen": '2questionsConditionalScreen',
        conditionalAccordionScreen: 'conditionalAccordionScreen',
        encryptingBallotScreen: 'encryptingBallotScreen',
        castOrCancelScreen: 'castOrCancelScreen',
        reviewScreen: 'reviewScreen',
        castingBallotScreen: 'castingBallotScreen',
        successScreen: 'successScreen'
      };

      // override state if in debug mode and it's provided via query param
      function setState(newState, newStateData) {
        console.log("setting state to " + newState);
        scope.state = newState;
        scope.stateData = newStateData;
        scope.stateChange++;
      }

      scope.mapQuestion = function(question) {
        if (question.layout === "conditional-accordion") {
          return {
            state: stateEnum.conditionalAccordionScreen,
            sorted: true,
            ordered: true
          };
        } else if  (question.layout === "pcandidates-election") {
          return {
            state: stateEnum.pcandidatesElectionScreen,
            sorted: true,
            ordered: true
          };
        }

        var map = {
          "plurality-at-large": {
            state: stateEnum.multiQuestion,
            sorted: true,
            ordered: false
          },
          "borda-nauru": {
            state: stateEnum.multiQuestion,
            sorted: true,
            ordered: true
          },
          "borda": {
            state: stateEnum.multiQuestion,
            sorted: true,
            ordered: true
          },
          "pairwise-beta": {
            state: stateEnum.pairwiseBeta,
            sorted: true,
            ordered: true
          }
        };
        return map[question.tally_type];
      };

      // given a question number, looks at the question type and tells the
      // correct state to set, so that the associated directive correctly shows
      // the given question
      function goToQuestion(n, reviewMode) {
        // first check for special election-wide layouts
        var layout = scope.election.layout;
        if (layout === "2questions-conditional") {
          scope.setState(stateEnum["2questionsConditionalScreen"], {
            isLastQuestion: true,
            reviewMode: true,
            filter: ""
          });
          return;
        }

        var question = scope.election.questions[n];
        var mapped = scope.mapQuestion(question);

        scope.setState(mapped.state, {
          question: scope.election.questions[n],
          questionNum: n,
          isLastQuestion: (scope.election.questions.length === n + 1),
          reviewMode: reviewMode,
          filter: "",
          sorted: mapped.sorted,
          ordered: mapped.ordered,
          affixIsSet: false,
          pairNum: 0 // only used for pairwise comparison
        });
      }

      // changes state to the next one, calculating it and setting some scope
      // vars
      function next() {
        var questionStates = [
          stateEnum.multiQuestion,
          stateEnum.pcandidatesElectionScreen
        ];
        if (scope.state === stateEnum.startScreen)
        {
          goToQuestion(0, false);

        } else if (scope.state === stateEnum.reviewScreen)
        {
          if (!scope.stateData.auditClicked) {
            // in a demo, we don't send the ballot, we just show as if we had sent it
            if (scope.isDemo) {
              scope.setState(stateEnum.successScreen, {
                ballotHash: scope.stateData.ballotHash
              });
            // if we are not in a demo, send the ballot
            } else {
              scope.setState(stateEnum.castingBallotScreen, {
                encryptedBallot: scope.stateData.encryptedBallot,
                auditableBallot: scope.stateData.auditableBallot
              });
            }
          } else {
            scope.setState(stateEnum.auditBallotScreen, {
              encryptedBallot: scope.stateData.encryptedBallot,
              auditableBallot: scope.stateData.auditableBallot,
              ballotHash: scope.stateData.auditableBallot.ballot_hash
            });
          }

        } else if (scope.state === stateEnum.auditBallotScreen)
        {
          goToQuestion(0, false);

        } else if (scope.state === stateEnum.encryptingBallotScreen)
        {
          scope.setState(stateEnum.reviewScreen, {
            encryptedBallot: scope.stateData.encryptedBallot,
            auditableBallot: scope.stateData.auditableBallot,
            ballotHash: scope.stateData.auditableBallot.ballot_hash,
            auditClicked: false
          });

        } else if (scope.state === stateEnum.castingBallotScreen)
        {
          scope.setState(stateEnum.successScreen, {
            ballotHash: scope.stateData.ballotHash
          });

        } else if (scope.stateData.isLastQuestion || scope.stateData.reviewMode)
        {
          scope.setState(stateEnum.encryptingBallotScreen, {});

        } else if (_.contains(questionStates, scope.state) &&
                   !scope.stateData.isLastQuestion)
        {
          goToQuestion(scope.stateData.questionNum + 1, false);
        }
      }

      // shows the error string
      function showError(error) {
        if (scope.state === stateEnum.errorScreen) {
          console.log("already in an error state, new error appeared: " + error);
          return;
        }
        scope.setState(stateEnum.errorScreen, {error: error});
      }

      function launchHelp() {
        scope.setState(stateEnum.helpScreen, {
          oldState: {
            name: scope.state,
            data: angular.copy(scope.stateData)
          }});
      }

      function backFromHelp() {
        if (scope.state !== stateEnum.helpScreen) {
          console.log("error, calling to backFromHelp in another state");
          return;
        }

        scope.setState(
          scope.stateData.oldState.name,
          scope.stateData.oldState.data);
      }

      // init scope vars
      angular.extend(scope, {
        election: null,
        setState: setState,
        stateEnum: stateEnum,
        stateChange: 0,
        showError: showError,
        launchHelp: launchHelp,
        backFromHelp: backFromHelp,
        goToQuestion: goToQuestion,
        next: next,

        // stateData stores information used by the directive being shown.
        // Its content depends on the current state.
        stateData: {},

        // contains the clear text of the ballot. It's a list with an element
        // per question.
        // The format of each item in the array depends on the voting method for
        // the related question. This is used by the directives to store the
        // clear text of the ballot.
        ballotClearText: [],

        // convert config to JSON
        config: angular.fromJson(scope.configStr)
      });

      // execute pre-check first
      if (attrs.preCheck) {
        var ret = scope.preCheck();
        if (ret !== null) {
          showError(ret);
          return;
        }
      }

      setState(stateEnum.receivingElection, {});

      function retrieveElectionConfig() {
        try {
          $http.get(scope.baseUrl + "election/" + scope.electionId)
            // on success
            .success(function(value) {
              if (!scope.isDemo && value.payload.state !== "started") {
                showError($i18next("avBooth.errorElectionIsNotOpen"));
                return;
              }

              scope.election = angular.fromJson(value.payload.configuration);

              // index questions
              _.each(scope.election.questions, function(q, num) { q.num = num; });

              scope.pubkeys = angular.fromJson(value.payload.pks);
              // initialize ballotClearText as a list of lists
              scope.ballotClearText = _.map(
                scope.election.questions, function () { return []; });
              scope.setState(stateEnum.startScreen, {});
            })
            // on error, like parse error or 404
            .error(function (error) {
              showError($i18next("avBooth.errorLoadingElection"));
            });
        } catch (error) {
          showError($i18next("avBooth.errorLoadingElection"));
        }
      }
      function avPostAuthorization(e, errorHandler) {
        var action = "avPostAuthorization:";
        if (e.data.substr(0, action.length) !== action) {
          return;
        }

        var khmacStr = e.data.substr(action.length, e.data.length);
        var khmac = HmacService.checkKhmac(khmacStr);
        if (!khmac) {
          scope.authorizationReceiverErrorHandler();
          showError($i18next("avBooth.errorLoadingElection"));
          return;
        }
        scope.authorizationHeader = khmacStr;
        var splitMessage = khmac.message.split(":");

        if (splitMessage.length < 4) {
          scope.authorizationReceiverErrorHandler();
          return;
        }
        scope.voterId = splitMessage[0];
        scope.authorizationReceiver();
        scope.authorizationReceiver = null;
      }
      scope.setAuthorizationReceiver = function (callback, errorCallback) {
        scope.authorizationReceiver = callback;
        scope.authorizationReceiverErrorHandler = errorCallback;
      };

      $window.addEventListener('message', avPostAuthorization, false);
      retrieveElectionConfig();
    }


    return {
      restrict: 'AE',
      scope: {
        baseUrl: '@',
        voterId: '@',
        electionId: '@',
        authorizationHeader: '@',
        configStr: '@config',

        // optional function to be called before anything, that will return null
        // if there's no error, or the error to be shown if there was some
        preCheck: '&',
      },
      link: link,
      templateUrl: 'avBooth/booth-directive/booth-directive.html'
    };
  });
