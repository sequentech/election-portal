/**
 * Replacement for JSON.stringify in cases where the output needs to be
 * reproducable. In those cases, we have to sort the dictionaries before
 * stringifying them, something that JSON.stringify doesn't do.
 */
angular.module('avCrypto')
  .service('DeterministicJsonStringifyService', function() {
    function stringify(obj) {
        var i;
        if (Array.isArray(obj)) {
            var serialized = [];
            for(i = 0; i < obj.length; i++) {
                serialized.push(stringify(obj[i]));
            }
            return "[" + serialized.join(",") + "]";
        } else if (typeof(obj) === 'object') {
            if (obj == null) {
                return "null";
            }
            var sortedKeys = Object.keys(obj).sort();
            var arr = [];
            for(i = 0; i < sortedKeys.length; i++) {
                var key = sortedKeys[i];
                var value = obj[key];
                key = JSON.stringify(key);
                value = stringify(value);
                arr.push(key + ':' + value);
            }
            return "{" + arr.join(",") + "}";
        } else {
            return JSON.stringify(obj);
        }
    }
    return stringify;
  });