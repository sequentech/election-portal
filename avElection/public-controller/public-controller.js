/*
 * Shows the public view of an election. Controls mainly the changing inner states
 * loading config, showing results, showing error if needed.
 */
angular.module('avElection').controller('PublicController',
  function($state, $stateParams, $http, $scope, $i18next, ConfigService, InsideIframeService, Authmethod) {
//     $state.go('election.public.loading');

    var mapLayouts = {
      "": "default",
      "simple": "default",
      "pcandidates-election": "default",
      "2questions-conditional": "default",
      "conditional-accordion": "default",
      "ahoram-primaries": "default"
    };
    $("#theme").attr("href", "themes/" + ConfigService.theme + "/app.min.css");
    $scope.layout = mapLayouts["simple"];
    $scope.statePrefix = "election.public.show.home";
        $scope.inside_iframe = InsideIframeService();

    // get election config
    $http.get(ConfigService.baseUrl + "election/" + $stateParams.id)
      .success(function(value) {
        $scope.election = value.payload.configuration;
        $scope.layout = mapLayouts[$scope.election.layout];
        $scope.electionState = value.payload.state;
        $scope.results = angular.fromJson(value.payload.results);
      })
      // on error, like parse error or 404
      .error(function (error) {
        $state.go("election.public.error");
      });

    Authmethod.viewEvent($stateParams.id)
      .success(function(data) {
        if (data.status === "ok") {
          $scope.authEvent = data.events;
        }
      });
  }
);
