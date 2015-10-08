/*
 * Available Options directive.
 *
 * Lists the available options for a question, allowing to change selection.
 */
angular.module('avBooth')
  .directive('avbAvailableOptions', function($filter) {

    var link = function(scope, element, attrs) {
        scope.options = scope.question.answers;
        scope.tagMax = null;
        scope.noTagMax = null;
        if (angular.isDefined(scope.question.extra_options))
        {
          if (angular.isDefined(scope.question.extra_options.restrict_choices_by_tag__max))
          {
            scope.tagMax = parseInt(scope.question.extra_options.restrict_choices_by_tag__max, 10);
          }
          if (angular.isDefined(scope.question.extra_options.restrict_choices_by_no_tag__max))
          {
            scope.noTagMax = parseInt(scope.question.extra_options.restrict_choices_by_no_tag__max, 10);
          }
        }

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

        if (scope.question.presetSelected === true) {
          scope.options = _.filter(
            scope.question.answers,
            function (answer) {
              return scope.getTag(answer) !== scope.question.extra_options.recommended_preset__tag;
            });
        }

        // initialize selection
        scope.tagName = undefined;
        if (scope.question.extra_options) {
          scope.tagName = scope.question.extra_options.restrict_choices_by_tag__name;
        }
        _.each(scope.options, function (element) {
          if (element.selected === undefined) {
            element.selected = -1;
          }
        });

        /*
         * Clear selection
         */
        scope.clearSelection = function () {
          _.each(scope.options, function (element) {
            if (element.selected !== -1) {
              element.selected = -1;
            }
          });
        };

        scope.numSelectedOptions = function () {
          return _.filter(
            scope.options,
            function (element) {
              return element.selected > -1 || element.isSelected === true;
            }).length;
        };

        /*
         * Toggles selection, if possible.
         */
        scope.toggleSelectItem = function(option) {
          if (option.selected > -1) {
            _.each(scope.question.answers, function (element) {
              if (element.selected > option.selected) {
                element.selected -= 1;
              }
            });
            option.selected = -1;
          } else {
            // if max options selectable is 1, deselect any other and select
            // this
            if (scope.max === 1) {
              _.each(scope.question.answers, function (element) {
                if (element.selected > option.selected) {
                  element.selected -= 1;
                }
              });
              option.selected = 0;
              return;
            }

            var numSelected = _.filter(scope.question.answers, function (element) {
              return element.selected > -1;
            }).length;

            // can't select more, flash info
            if (numSelected === parseInt(scope.max,10)) {
              return;
            }

            // check that number of tagged selected does not exceed max
            if (!!scope.tagName) {
              var numTaggedSelected = _.filter(scope.question.answers, function (element) {
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

        // filter function that filters option.value ignoring accents
        function ignoreAccents(item) {
            if (!scope.filter) {
              return true;
            }

            var text = removeAccents(item.text.toLowerCase());
            var filter = removeAccents(scope.filter.toLowerCase());
            return text.indexOf(filter) > -1;
        }


        function updateFilteredOptions() {
          scope.filteredOptions = $filter('filter')(scope.options, ignoreAccents);
        }

        scope.$watch("filter", updateFilteredOptions);
        updateFilteredOptions();
    };

    return {
      restrict: 'AE',
      scope: {
        // max number of selected options allowed
        max: '=',

        // min number of selected options allowed
        min: '=',

        // list of options
        question: '=',

        // layout, changes the way the options are rendered
        layout: '=',

        // only if max is 1 and autoSelectAnother is true, then selecting
        // an option automatically removes any previous selection if any.
        autoSelectAnother: '=',

        // text used to filter the shown options
        filter: '@'
      },
      link: link,
      templateUrl: 'avBooth/available-options-directive/available-options-directive.html'
    };
  });
