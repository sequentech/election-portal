/*
 * Pairwise beta directive.
 *
 * Selection is saved in scope.stateData.question.selection, as an array of
 * ordered pairs, where the first element of each pair is the preferred.
 */
angular.module('avBooth')
  .directive('avbPairwiseBeta', function(RandomHelper, $location) {

    var link = function(scope, element, attrs) {
      // handy reference
      var question = scope.stateData.question;

      /*
       * Sets the pair to be shown. As the answers list is repeatably shuffled,
       * pairs are taken directly and linearly from that list, i.e. the 1st
       * pair are the items 0 and 1, the second pair are the items 1 and 2, etc
       *
       * stateData might specify that we should continue from a specific pairNum
       */
      scope.showNextPair = function() {
        scope.one = question.answers[scope.stateData.pairNum*2];
        scope.two = question.answers[scope.stateData.pairNum*2 + 1];
      };

      /**
       * Either show next pair for comparison, or go to the next step
       * (which can either be show the next question or show the review screen)
       */
      scope.continue = function() {
        if (question.max > scope.stateData.pairNum) {
          console.log("clicked continue when it shouldn't be able");
          return;
        }
        scope.next();
      };

      /**
       * Selects an answer, from one of the pairs. index can either be 1 or 2
       */
      scope.selectAnswer = function (index) {
        if (index !== 1 && index !== 2) {
          throw "Invalid index for selectAnswer";
        }

        if (index === 1) {
          question.selection[scope.stateData.pairNum] = [scope.one, scope.two];
        } else {
          question.selection[scope.stateData.pairNum] = [scope.two, scope.one];
        }

        scope.stateData.pairNum++;
        if (scope.stateData.pairNum < question.max) {
          scope.showNextPair();
        } else {
          scope.next();
        }
      };

      /**
       * Returns the answer's urls as an associative array
       */
      scope.getUrls = function (answer) {
        return _.object(_.map(answer.urls, function(url) {
          return [url.title, url.url];
        }));
      };

      scope.isYoutube = function (answer) {
        var url = scope.getUrls(answer)['Image URL'];
        return !!url && url.indexOf("https://youtube.com") === 0;
      };

      /**
       *  initializes the directive
       */
      function init() {
        // shuffles answers in a repeatable way if a seed is given as a query
        // param
        var i = -1;
        var seedQuery = $location.search()['seed'];
        var seed = (!!seedQuery) ? seedQuery : null;

        if (!question.shuffled) {
          RandomHelper.shuffle(question.answers, RandomHelper.prng(seed));
          question.shuffled = true;
        }

        // initializes selection
        if (!question.selection) {
          question.selection = Array(question.max);
        }

        // show next pair
        scope.showNextPair();
      }

      // finally, call to init
      init();
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/pairwise-beta-directive/pairwise-beta-directive.html'
    };
  });