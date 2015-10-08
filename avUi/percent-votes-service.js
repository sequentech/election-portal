/*
 * Returns the percentage of votes received by an answer. The base number
 * of the percentage that is used depends on the
 * "answer_total_votes_percentage" option in the question.
 */
angular.module('avUi')
  .service('PercentVotesService', function() {
    return function (total_votes, question, over, format) {
      if (format === undefined) {
        format = "str";
      }
      
      function print(num) {
        if (format === "str") {
          return num.toFixed(2) + "%";
        } else {
          return num;
        }
      }

      // special case
      if (total_votes === 0) {
        return print(0.00);
      }

      var base = question.totals.valid_votes + question.totals.null_votes + question.totals.blank_votes;
      if (over === undefined || over === null) {
        over = question.answer_total_votes_percentage;
      }
      if (over === "over-valid-votes") {
        base = question.totals.valid_votes;
      }

      return print(100*total_votes / base);
    };
  });
