/**
 * This file is part of agora-gui-elections.
 * Copyright (C) 2015-2021  Agora Voting SL <agora@agoravoting.com>

 * agora-gui-elections is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License.

 * agora-gui-elections  is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with agora-gui-elections.  If not, see <http://www.gnu.org/licenses/>.
**/

/* jshint ignore:start */

describe("Public Controller tests", function () {

  beforeEach(module("avElection"));

  var $controller, $rootScope;

  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  describe("$scope", function() {
    it("Test public controller", function () {
      var $scope = $rootScope.$new();
      var controller = $controller('PublicController', {
        $scope: $scope,
        $stateParams: { id: 1, code: 'qwerty', email: 'test@nvotes.com', isOpenId: false },
        $filter: undefined,
        $i18next: undefined,
        $cookies: undefined,
        $window: window,
        ConfigService: { authAPI: '' },
        Authmethod: {
          viewEvent: function() {
            return {
              then: function(fn) {
                fn({ data: {} });
              },
            };
          },
        },
        InsideIframeService: function() {},
        $http: {
          get: function(path) {
            if (path.match(/legal/)) {
              return {
                then: function(fn) { return fn({}) },
                catch: function(fn) {},
              };
            } else if (path.match(/election/)) {
              return {
                then: function(fn) {
                  fn({
                    data: {
                      payload: { configuration: { id: 1 } },
                      state: 'new',
                    }
                  });

                  return { catch: function(fn) {} };
                },
                catch: function(fn) {},
              };
            } else {
              return {
                then: function(fn) { return fn({ data: { events: {} } }) },
                catch: function(fn) {},
              };
            }
          },
        },
      });
      expect($scope.showSelectResults).toBe(true);
    });
  });
});
