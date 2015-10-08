/*
 * Multiquestion directive.
 *
 * Shows a question and its possible answers to the user.
 */
angular.module('avBooth')
  .directive('avbMultiQuestion', function($modal) {

    var link = function(scope, element, attrs) {
      scope.stateData.affixIsSet = false;
      scope.stateData.affixDropDownShown = false;
      scope.hideSelection = false;

      scope.getUrl = function(option, title) {
        return _.filter(option.urls, function (url) {
          return url.title === title;
        })[0];
      };

      scope.getTag = function(option) {
        var url = scope.getUrl(option, "Tag");
        if (!url) {
          return null;
        }
        return url.url.replace("https://agoravoting.com/api/tag/", "");
      };

      // set options' tag
      scope.tagName = undefined;
      if (angular.isDefined(scope.stateData.question.extra_options)) {
        scope.tagName = scope.stateData.question.extra_options.restrict_choices_by_tag__name;
      }
      _.each(scope.stateData.question.answers, function (element) {
        element.tag = null;
        if (angular.isDefined(scope.tagName) && scope.getTag(element) === scope.tagName) {
          element.tag = scope.tagName;
        }
      });

      /*
        * Toggles selection, if possible.
        */
      scope.toggleSelectItem = function(option) {
        if (option.selected > -1) {
          _.each(scope.stateData.question.answers, function (element) {
            if (element.selected > option.selected) {
              element.selected -= 1;
            }
          });
          option.selected = -1;
        } else {
          // if max options selectable is 1, deselect any other and select
          // this
          if (scope.max === 1) {
            _.each(scope.stateData.question.answers, function (element) {
              if (element.selected > option.selected) {
                element.selected -= 1;
              }
            });
            option.selected = 0;
            return;
          }

          var numSelected = _.filter(scope.stateData.question.answers, function (element) {
            return element.selected > -1;
          }).length;

          // can't select more, flash info
          if (numSelected === parseInt(scope.max,10)) {
            return;
          }

          // check that number of tagged selected does not exceed max
          if (!!scope.tagName) {
            var numTaggedSelected = _.filter(scope.stateData.question.answers, function (element) {
              return element.tag === scope.tagName && element.selected > -1;
            }).length;

            if ((option.tag === scope.tagName && numTaggedSelected === scope.tagMax) ||
              (option.tag !== scope.tagName && numSelected - numTaggedSelected === scope.noTagMax))
            {
              return;
            }
          }

          option.selected = numSelected;
        }
      };

      function isExtraDefined(extra) {
        return angular.isDefined(scope.stateData.question.extra_options) && angular.isDefined(scope.stateData.question.extra_options[extra]);
      }

      // presets support
      scope.stateData.question.presetSelectedSize = 0;
      scope.stateData.question.showPreset = isExtraDefined("recommended_preset__tag");
      scope.showingPreset = scope.stateData.question.showPreset;
      if (!angular.isDefined(scope.stateData.question.presetSelected)) {
        scope.stateData.question.presetSelected = null;
      } else {
        scope.stateData.question.presetList = _.filter(
          scope.stateData.question.answers,
          function (answer) {
            return scope.getTag(answer) === scope.stateData.question.extra_options.recommended_preset__tag;
          });

        scope.stateData.question.presetSelected = _.filter(
          scope.stateData.question.presetList,
          function (answer) {
            return answer.selected !== answer.id;
          }).length === 0;

        scope.stateData.question.presetSelectedSize = scope.stateData.question.presetList.length;
      }

      scope.numSelectedOptions = function () {
        return _.filter(
          scope.stateData.question.answers,
          function (element) {
            return element.selected > -1 || element.isSelected === true;
          }).length;
      };

      scope.numTaggedSelectedOptions = function() {
        var val = _.filter(
          scope.stateData.question.answers,
          function (element) {
            return (element.selected > -1 || element.isSelected === true) &&
              element.tag === scope.tagName;
          }).length;
        return val;
      };

      scope.tagMax = null;
      scope.noTagMax = null;
      if (angular.isDefined(scope.stateData.question.extra_options))
      {
        if (angular.isDefined(scope.stateData.question.extra_options.restrict_choices_by_tag__max))
        {
          scope.tagMax = parseInt(scope.stateData.question.extra_options.restrict_choices_by_tag__max, 10);
        }
        if (angular.isDefined(scope.stateData.question.extra_options.restrict_choices_by_no_tag__max))
        {
          scope.noTagMax = parseInt(scope.stateData.question.extra_options.restrict_choices_by_no_tag__max, 10);
        }
      }

      var question = scope.stateData.question;
      if (question.layout === "") {
        question.layout = "simple";
      }
      if (_.contains(['circles'], question.layout)) {
        scope.hideSelection = true;
      }
      if (question.randomize_answer_order) {
          // we can't just sample the groupedOptions list because we need to
          // 1. use the same list object
          // 2. generate a specific ordering for all the options
          var i = -1;
          var answers = question.answers;
          var shuffledNumbers = _.shuffle(_.map(answers, function () { i += 1; return i;}));
          // map different sort orders
          var shuffledAnswers = _.map(shuffledNumbers, function (index) { return answers[index].sort_order;});
          // now, assign
          _.each(answers, function (opt, index) { opt.sort_order = shuffledAnswers[index];});
          answers.sort(function (item1, item2) { return item1.sort_order - item2.sort_order; });
          scope.stateData.question.answers = answers;
      }

      scope.selectPresets = function () {
        scope.unselectPresets();
        scope.stateData.question.presetSelected = true;
        _.each(
          scope.stateData.question.answers,
          function (answer) {
            if (scope.getTag(answer) === scope.stateData.question.extra_options.recommended_preset__tag) {
              scope.stateData.question.presetSelectedSize += 1;
              scope.toggleSelectItem(answer);
            }
          });
      };

      scope.unselectPresets = function() {
        scope.stateData.question.presetSelectedSize = 0;
        scope.stateData.question.presetSelected = false;
        _.each(
          scope.stateData.question.answers,
          function (answer) {
            answer.selected = -1;
          });
      };

      scope.presetNext = function() {
        // show null vote warning
        if (scope.stateData.question.presetSelected === null) {
          $modal.open({
            templateUrl: "avBooth/confirm-null-vote-controller/confirm-null-vote-controller.html",
            controller: "ConfirmNullVoteController",
            size: 'md'
          }).result.then(function () {
            scope.showingPreset = false;
          });
          return;
        }

        scope.showingPreset = false;
        if (!scope.stateData.question.presetSelected) {
          return;
        }

        if (scope.stateData.question.presetSelected === true) {
          scope.filteredOptions = _.filter(
            scope.stateData.question.answers,
            function (answer) {
              return scope.getTag(answer) !== scope.stateData.question.extra_options.recommended_preset__tag;
            });
          if (scope.stateData.question.presetSelectedSize === scope.stateData.question.max) {
            scope.next();
          }
        }
      };

      // questionNext calls to scope.next() if user selected enough options.
      // If not, then it flashes the #selectMoreOptsWarning div so that user
      // notices.
      scope.questionNext = function() {
        if (scope.numSelectedOptions() < scope.stateData.question.min)
        {
          if (scope.numSelectedOptions() > 0 ||
            !angular.isDefined(scope.stateData.question.extra_options) ||
            scope.stateData.question.extra_options.force_allow_blank_vote !== "TRUE")
          {
            $("#selectMoreOptsWarning").flash();
            return;
          }
        }

        // show null vote warning
        if (scope.numSelectedOptions() === 0) {
          $modal.open({
            templateUrl: "avBooth/confirm-null-vote-controller/confirm-null-vote-controller.html",
            controller: "ConfirmNullVoteController",
            size: 'md'
          }).result.then(scope.next);
        } else {
          scope.next();
        }
      };
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/multi-question-directive/multi-question-directive.html'
    };
  });