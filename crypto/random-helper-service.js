/*
 * Random utility functions, using a repeatable by seed algorithm
 *
 * NOTE: It uses RC4 algorithm, so it's not cryptographically secure random, but
 * it's a good enough distribution for other purposes like shuffling items.
 */
angular.module('avUi')
  .service('RandomHelper', function() {
    var self = {
      /*
       * generates a Pseudo-Random Number Generator with the given seed
       */
      prng: function (seed)
      {
        /* jshint ignore:start */
        return new RNG(seed);
        /* jshint ignore:end */
      },

      /*
       * shuffle an array with a given seed, altering the array items' order
       */
      shuffle: function (l, prng)
      {
        var length = l.length;
        for (var index = length - 1, rand, item; index >= 0; index--) {
          rand = prng.random(0, index);
          if (rand !== index) {
            item = l[index];
            l[index] = l[rand];
            l[rand] = item;
          }
        }
      }
    };
    return self;
  });
