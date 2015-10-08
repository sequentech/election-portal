/*
 * Drafts election screen directive.
 *
 * This is a multiple question view, crafted for a specific election that has
 * some unique details.
 */
angular.module('avBooth')
  .directive('avbPcandidatesElectionScreen', function($i18next, $filter, $interpolate, $timeout, $window, $modal) {

    var link = function(scope, element, attrs) {
      scope.warningEnum = {
        // shown when the user has already select all possible options
        maxSelectedLimitReached: "maxSelectedLimitReached",
        cannotSelectAll: "cannotSelectAll"
      };

      scope.stateData.affixIsSet = false;
      scope.stateData.affixDropDownShown = false;

      // get the name of our question group. A question group allows to know
      // what questions shold be shown together in a pcandidates layout, where
      // questions are shown as columns and candidate groups as rows
      var group = scope.stateData.question.extra_options.group;

      // filter the list of questions to get the list of questions of our group
      var groupQuestions = scope.groupQuestions = _.filter(
        scope.election.questions,
        function (q) {
          return q.extra_options.group === group;
        });

      var lastGroupQuestion = groupQuestions[groupQuestions.length-1];
      var lastGroupQuestionIndex = lastGroupQuestion.num;
      // update if it's last question and set questionNum to the last in the
      // group

      scope.stateData.isLastQuestion = (
        scope.stateData.isLastQuestion ||
        scope.election.questions.length === lastGroupQuestionIndex + 1);
      scope.stateData.questionNum = lastGroupQuestionIndex;

      // from each question of our group, get the extra_data, and then fusion
      // all the extra_datas of our question group into one
      var groupExtraData = _.extend.apply(_,
        _.union(
          [{}],
          _.map(groupQuestions, function (q) { return q.extra_options; })));

      // set next button text by default if it has not been specified
      if (!!groupExtraData.next_button && !scope.stateData.isLastQuestion) {
        scope.nextButtonText = groupExtraData.next_button;
      } else {
        scope.nextButtonText = $i18next('avBooth.continueButton');
      }

      /*
       * Toggles selection, if possible.
       */
      scope.toggleSelectItem = function(option) {
        var selection = scope.getSelection();
        var subselection = _.filter(option.documents, function (doc) {
          return doc.selected > -1;
        });

        scope.clearSelectionWarnings();
      };

      scope.deselectTeam = function(team) {
        // deselect the whole group
        _.each(team.options, function (cell) {
          _.each(cell, function(option) {
            option.selected = -1;
          });
          cell.selected = 0;
        });
        team.isSelected = false;
        scope.clearSelectionWarnings();
      };

      scope.toggleTeam = function(team) {
        var canSelect = true;
        var teamSize = team.group.length;
        var totalSelectedInTeam = _.filter(team.group, function (opt) {
          return opt.selected > -1;
        }).length;

        // deselect if all team options are already selected
        if (teamSize === totalSelectedInTeam) {
          scope.deselectTeam(team);
        // try to select all if not all were selected
        } else {

          // detect if we can select
          _.each(team.options, function (cell, index) {
            // the maximum number of selected items for this question
            if (_.filter(scope.getSelection(), function (opt) {
                return opt.group_index === index;
              }).length + cell.length - cell.selected > groupQuestions[index].max)
            {
              canSelect = false;
            }
          });

          // if we can't select the row, then deselect it, unless it has no selection
          // then show warning
          if (!canSelect && totalSelectedInTeam > 0) {
            return scope.deselectTeam(team);
          } else if (!canSelect && totalSelectedInTeam === 0) {
//             _.each(scope.election.questions, function(_, index) {
//               team["isOpen" + index] = true;
//             });
            return scope.showWarning(scope.warningEnum.cannotSelectAll);
          }

          // select the whole group
          _.each(team.options, function (cell) {
            _.each(cell, function(option) {
              option.selected = option.sort_order;
            });
            cell.selected = cell.length;
          });
          team.isSelected = true;
        }
        scope.clearSelectionWarnings();
      };

      scope.toggleCell = function (team, index) {
        // if cell is totally selected, deselect it all
        var question_index = groupQuestions[index].question_index;
        var cell = team.options[index];
        if (cell.selected === cell.length) {
          _.each(cell, function(option) {
            option.selected = -1;
          });
          cell.selected = 0;
          scope.clearSelectionWarnings();

        // if less than all the elements are selected, select them all
        } else {
          var selection = scope.getSelection();
          // check that adding the options that are not selected does not exceed
          // the maximum number of selected items for this question
          if (_.filter(scope.getSelection(), function (opt) {
              return opt.question_index === question_index;
            }).length + cell.length - cell.selected > groupQuestions[index].max)
          {
            // if cell is not open.. open it. DISABLED
//             if (!team["isOpen" + question_index]) {
//               if ($window.innerHeight < 768) {
//                 team["isOpen" + question_index] = true;
//               } else {
//                 _.each(scope.election.questions, function(_, index) {
//                   team["isOpen" + index] = true;
//                 });
//               }
//             }
            return scope.showWarning(scope.warningEnum.cannotSelectAll);
          }

          // checks done -> select them all
          _.each(cell, function(option) {
            if (option.selected !== option.sort_order) {
              option.selected = option.sort_order;
            }
          });
          cell.selected = cell.length;
          scope.clearSelectionWarnings();
        }

        team.isSelected = $filter("avbHasSelectedOptions")(team.group);
      };

      scope.toggleCandidate = function (team, candidate) {
        // if not selected --> try to select it
        var cell = team.options[candidate.group_index];
        if (candidate.selected === -1) {
          if (_.filter(scope.getSelection(), function (opt) {
              return opt.question_index === candidate.question_index;
            }).length + 1 > groupQuestions[candidate.group_index].max)
          {
            return scope.showWarning(scope.warningEnum.cannotSelectAll);
          }

          candidate.selected = candidate.sort_order;
          cell.selected += 1;
          scope.clearSelectionWarnings();

        // deselect it
        } else {
          candidate.selected = -1;
          cell.selected -= 1;
          scope.clearSelectionWarnings();
        }
        team.isSelected = $filter("avbHasSelectedOptions")(team.group);
      };

      scope.getSelection = function () {
        return $filter('avbSelectedOptions')(scope.allOptions);
      };

      scope.numSelectedByQuestionIndex = function (index) {
        return _.filter(scope.getSelection(), function (opt) {
            return opt.group_index === index;
          }).length;
      };

      scope.numTotalByQuestionIndex = function (index) {
        return groupQuestions[index].max;
      };

      scope.showWarning = function (warn) {
        // if warning is already being shown, just flash it instantly
        if (scope.shownWarning === warn) {
            $("#" + warn).flash();

        // if warning is not being shown, then change it and wait a bit for it
        // to be shown to flash it
        } else {
          scope.shownWarning = warn;
          $timeout(function () {
            $("#" + warn).flash();
          }, 150);
        }
      };

      // reduce all the options of all questions in only one list, but each
      // answer is tagged with its question_slug (apart from the tag of the
      // category) This kind of list is good for filtering/searching
      _.each(groupQuestions, function(question, index) {
        question.question_index = question.num;
        question.group_index = index;
      });
      scope.allOptions = _.reduce(groupQuestions, function(memo, question) {
        var taggedAnswers = _.map(question.answers, function (answer) {
          answer.question_index = question.question_index;
          answer.group_index = question.group_index;
          answer.title = answer.text;
          if (answer.selected === undefined) {
            answer.selected = -1;
          }
          return answer;
        });
        return _.union(memo, taggedAnswers);
      }, []);

      // change sort_order of "Candidatura no agrupadas" options, or use any
      // other categories if specified as an extra_options.shuffled_categories.
      var shuffledCategories = [];
      var scats = scope.stateData.question.extra_options.shuffled_categories;
      if (angular.isDefined(scats)) {
        shuffledCategories = scats.split(",");
      }

      var filtered = _.filter(
        scope.allOptions,
        function(opt) { return _.contains(shuffledCategories, opt.category); });

      // we can't just sample the groupedOptions list because we need to
      // 1. use the same list object
      // 2. generate a specific ordering for all the options
      var i = -1;
      var randomFiltered = _.shuffle(_.map(filtered, function () { i += 1; return i;}));
      // map different sort orders
      randomFiltered = _.map(randomFiltered, function (index) { return filtered[index].sort_order;});
      // now, assign
      _.each(filtered, function (opt, index) { opt.sort_order = randomFiltered[index];});

      // group answers by category
      scope.groupedOptions = _.map(
        _.groupBy(scope.allOptions, "category"),
        function (group) {
          var groupedByQuestion = _.groupBy(group, "question_index");
          _.each(groupedByQuestion, function(l, key, list) {
            if (l === undefined) {
              return;
            }
            l.sort(function (item1, item2) { return item1.sort_order - item2.sort_order; });
          });
          _.each(groupQuestions, function(q, index) {
            groupedByQuestion["isOpen" + index] = false;
            groupedByQuestion["isOpen" + index + "Dropdown"] = false;
          });
          return $.extend({
            sortOrder: group[0].sort_order,
            isSelected: $filter("avbHasSelectedOptions")(group),
            title: group[0].category,
            group: group,
            options: _.map(groupQuestions, function (question) {
              if (groupedByQuestion[question.question_index] !== undefined) {
                return groupedByQuestion[question.question_index];
              } else {
                return [];
              }
            }),
          }, groupedByQuestion);
        });

      scope.toggleOpen = function (team) {
          var current = team["isOpen0"];
          _.each(groupQuestions, function(q, index) {
            team["isOpen" + index] = !current;
          });
      };

      scope.toggleOpenDropdown = function (team) {
        var current = team["isOpen0Dropdown"];
          _.each(groupQuestions, function(q, index) {
            team["isOpen" + index + "Dropdown"] = !current;
          });
      };

      // randomize by column, or randomly by no column if question_index is -1
      // randomize by no column but if all columns are set show first
      // if question_index is -2.
      scope.randomizeByColumn = function (index) {
        var max = scope.groupedOptions.length;

        // we can't just sample the groupedOptions list because we need to
        // 1. use the same list object
        // 2. generate a specific ordering for all the options
        var i = 0;
        var randomList = _.shuffle(
          _.map(scope.groupedOptions,
            function () { i += 1; return i;}
          ));

        for (i = 0; i < max; i++) {
          var team = scope.groupedOptions[i];

          if (index === -2) {
            team.sortOrder = randomList[i]+ max*groupQuestions.length;
            /* jshint ignore:start */
            _.each(groupQuestions, function(q, gqi) {
              if (team.options[gqi].length > 0) {
                team.sortOrder -= max;
              }
            });
            /* jshint ignore:end */
          } else if (index === -1 || team.options[index].length > 0) {
            team.sortOrder = randomList[i];
          } else {
            /* jshint ignore:start */
            _.each(groupQuestions, function(q, gqi) {
              if (team.options[gqi].length > 0) {
                team.sortOrder = randomList[i] + max*(1 + gqi);
              }
            });
            /* jshint ignore:end */
          }
        }
        scope.groupedOptions.sort(function (item1, item2) { return item1.sortOrder - item2.sortOrder; });
        updateFilteredOptions();
      };

      if (scope.stateData.question.extra_options.shuffling_policy === 'categories-with-all-columns-first-but-random') {
        scope.randomizeByColumn(-2);
      } else {
        // by default sort randomly, by no column
        scope.randomizeByColumn(-1);
      }

      scope.numSelectedOptions = function () {
        return _.filter(
          scope.allOptions,
          function (element) {
            return element.selected > -1;
          }).length;
      };


      // TODO: only use this when localeCompare is unavailable
      function removeAccents(value) {
        return value
          .replace(/á/g, 'a')
          .replace(/é/g, 'e')
          .replace(/í/g, 'i')
          .replace(/ó/g, 'o')
          .replace(/ú/g, 'u')
          .replace(/ñ/g, 'n');
      }

      function hasMatch(text, filter) {
        return removeAccents(text.toLowerCase()).indexOf(filter) > -1;
      }

      // filter function that filters option.value ignoring accents
      function filterRow(team) {
          if (!scope.stateData.filter) {
            return true;
          }

          var filter = removeAccents(scope.stateData.filter.toLowerCase());
          if (hasMatch(team.title, filter)) {
            return true;
          }
          /* jshint ignore:start */
          for (var i = 0; i < groupQuestions.length; i++) {
            if (_.find(team.options[i], function (candidate) {
                return hasMatch(candidate.text, filter);
              }) !== undefined) {
              return true;
            }
          }
          /* jshint ignore:end */
          return false;
      }


      function updateFilteredOptions() {
        scope.filteredOptions = $filter('filter')(scope.groupedOptions, filterRow);
      }

      scope.$watch("stateData.filter", updateFilteredOptions);
      updateFilteredOptions();


      scope.showNext = function() {
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

      // watch for changes in selection, changing the warning if need be
      scope.shownWarning = "";
      scope.clearSelectionWarnings = function () {
        scope.shownWarning  = "";
      };
      scope.clearSelectionWarnings();
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/pcandidates-election-screen-directive/pcandidates-election-screen-directive.html'
    };
  });