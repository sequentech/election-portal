/*
 * Checks input data with a list of checks.
 *
 * Example:
 *
        var checks = [
          {
            check: "array-group",
            prefix: "question-",
            checks: [
              {check: "is-array", key: "questions"},
              {check: "array-length", key: "questions", min: 1, max: 40},
              {
                check: "array-key-group-chain",
                key: "questions",
                prefix: "question-",
                checks: [
                  {check: "is-int", key: "min"},
                  {check: "is-int", key: "max"},
                  {check: "is-int", key: "num_winners"},
                  {check: "is-array", key: "answers"},
                  {check: "array-length", key: "answers", min: 1, max: 10000},
                  {check: "int-size", key: "min", min: 0, max: "$value.max"},
                  {
                    check: "int-size",
                    key: "max",
                    min: "$value.min",
                    max: "$value.answers.length"
                  },
                  {
                    check: "int-size",
                    key: "num_winners",
                    max: "$value.answers.length"
                  }
                ]
              }
            ]
          }
        ];

        scope.errors = [];
        CheckerService({
          checks: checks,
          data: scope.elections,
          onError: function (errorKey, errorData) {
            scope.errors.push({
              data: errorData,
              key: errorKey
            });
          }
        });
 */
angular.module('avUi')
  .service('CheckerService', function() {
    function checker(d) {

      /*
       * Used to eval the expressions given by the programmer in the checker
       * script
       */
      function evalValue(code, $value) {
        if (angular.isString(code)) {
          /* jshint ignore:start */
          return eval(code);
          /* jshint ignore:end */
        } else {
          return code;
        }
      }

      function sumStrs(str1, str2) {
        var ret = "";
        if (angular.isString(str1)) {
          ret = str1;
        }
        if (angular.isString(str2)) {
          ret += str2;
        }
        return ret;
      }

      function error(errorKey, errorData, postfix) {
        angular.extend(errorData, d.errorData);
        d.onError(
          _.reduce([d.prefix, errorKey, postfix], sumStrs, ""),
          errorData
        );
      }

      if (angular.isUndefined(d.errorData)) {
        d.errorData = {};
      }

      var ret = _.every(d.checks, function (item) {
        var pass = true;
        var itemMin;
        var itemMax;
        var max;
        var min;
        if (item.check === "is-int") {
          pass = angular.isNumber(d.data[item.key], item.postfix);
          if (!pass) {
            error(item.check, {key: item.key}, item.postfix);
          }

        } else if (item.check === "is-array") {
          pass = angular.isArray(d.data[item.key], item.postfix);
          if (!pass) {
            error(item.check, {key: item.key}, item.postfix);
          }

        } else if (item.check === "lambda") {
          if (!item.validator(d.data[item.key])) {
            error(item.check, {key: item.key}, item.postfix);
          }

        } else if (item.check === "is-string") {
          pass = angular.isString(d.data[item.key], item.postfix);
          if (!pass) {
            error(item.check, {key: item.key}, item.postfix);
          }

        } else if (item.check === "array-length") {
          itemMin = evalValue(item.min, d.data);
          itemMax = evalValue(item.max, d.data);

          if (angular.isArray(d.data[item.key]) || angular.isString(d.data[item.key]))
          {
            min = angular.isUndefined(item.min) || d.data[item.key].length >= itemMin;
            max = angular.isUndefined(item.max) || d.data[item.key].length <= itemMax;
            pass = min && max;
            if (!min) {
              error(
                "array-length-min",
                {key: item.key, min: itemMin, num: d.data[item.key].length},
                item.postfix);
            }
            if (!max) {
              var errorData = {key: item.key, max: itemMax, num: d.data[item.key].length};
              error(
                "array-length-max",
                errorData,
                item.postfix);
            }
          }

        } else if (item.check === "int-size") {
          itemMin = evalValue(item.min, d.data);
          itemMax = evalValue(item.max, d.data);
          min = angular.isUndefined(item.min) || d.data[item.key] >= itemMin;
          max = angular.isUndefined(item.max) || d.data[item.key] <= itemMax;
          pass = min && max;
          if (!min) {
            error(
              "int-size-min",
              {key: item.key, min: itemMin, value: d.data[item.key]},
              item.postfix);
          }
          if (!max) {
            error(
              "int-size-max",
              {key: item.key, max: itemMax, value: d.data[item.key]},
              item.postfix);
          }
        } else if (item.check === "group-chain") {
          pass = _.all(
            _.map(
              item.checks,
              function(check) {
                return checker({
                  data: d.data,
                  errorData: d.errorData,
                  onError: d.onError,
                  checks: [check],
                  prefix: sumStrs(d.prefix, item.prefix)
                });
              })
            );
        } else if (item.check === "array-key-group-chain") {
          pass = _.every(
            d.data[item.key],
            function (data, index) {
              var extra = {};
              var prefix = "";
              if (angular.isString(d.prefix)) {
                prefix = d.prefix;
              }
              if (angular.isString(item.prefix)) {
                prefix += item.prefix;
              }
              extra.prefix = prefix;
              extra[item.append.key] = evalValue(item.append.value, data);
              return checker({
                data: data,
                errorData: angular.extend({}, d.errorData, extra),
                onError: d.onError,
                checks: item.checks,
                prefix: sumStrs(d.prefix, item.prefix),
              });
            });
        } else if (item.check === "array-group-chain") {
          pass = _.every(d.data, function (data, index) {
            var extra = {};
            extra[item.append.key] = evalValue(item.append.value, data);
            return checker({
              data: data,
              errorData: angular.extend({}, d.errorData, extra),
              onError: d.onError,
              checks: item.checks,
              prefix: sumStrs(d.prefix, item.prefix),
            });
          });
        } else if (item.check === "array-group") {
          pass = _.contains(
            _.map(
              d.data,
              function (data, index) {
                var extra = {};
                extra[item.append.key] = evalValue(item.append.value, data);
                return checker({
                  data: data,
                  errorData: angular.extend({}, d.errorData, extra),
                  onError: d.onError,
                  checks: item.checks,
                  prefix: sumStrs(d.prefix, item.prefix),
                });
              }),
            true);
        }
        if (!pass && d.data.groupType === 'chain') {
          return false;
        }
        return true;
      });

      return ret;
    }
    return checker;
  });
