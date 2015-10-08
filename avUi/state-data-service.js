/*
 * Save data between states.
 *
 * Example:
 *
 *    StateDataService.go('election.public.show.login', {id: autheventid}, {something: "foo"})
 *    StateDataService.getData() --> {something: "foo"}
 */
angular.module('avUi')
  .service('StateDataService', function($state) {
    var data = {};
    return {
      go: function (path, stateData, newData) {
        data = angular.copy(newData);
        $state.go(path, stateData);
      },
      getData: function () {
        return data;
      }
    };
  });
