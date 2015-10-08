/*
The MIT License (MIT)
Copyright (c) 2014 Kent C. Dodds
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Source: https://github.com/kentcdodds/kcd-angular
Copyright (c) 2014 Kent C. Dodds kent+github@doddsfamily.us
 */

angular.module('avUi').directive('avRecompile', function($compile, $parse) {
  'use strict';
  function getElementAsHtml(el) {
    return angular.element('<a></a>').append(el.clone()).html();
  }

  return {
    scope: true, // required to be able to clear watchers safely
    compile: function(el) {
      var template = getElementAsHtml(el);
      return function link(scope, $el, attrs) {
        var stopWatching = scope.$parent.$watch(attrs.avRecompile, function(_new, _old) {
          var useBoolean = attrs.hasOwnProperty('useBoolean');
          if ((useBoolean && (!_new || _new === 'false')) || (!useBoolean && (!_new || _new === _old))) {
            return;
          }
          // reset kcdRecompile to false if we're using a boolean
          if (useBoolean) {
            $parse(attrs.kcdRecompile).assign(scope.$parent, false);
          }

          // recompile
          var newEl = $compile(template)(scope.$parent);
          $el.replaceWith(newEl);

          // Destroy old scope, reassign new scope.
          stopWatching();
          scope.$destroy();
        });
      };
    }
  };
});
