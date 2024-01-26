/**
 * This file is part of election-portal.
 * Copyright (C) 2015-2016  Sequent Tech Inc <legal@sequentech.io>

 * election-portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License.

 * election-portal  is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with election-portal.  If not, see <http://www.gnu.org/licenses/>.
**/

/*
 * Shows the public view of an election. Controls mainly the changing inner states
 * loading config, showing results, showing error if needed.
 */
angular
  .module('avElection')
  .controller(
    'PublicController',
    function(
      $state,
      $stateParams,
      $http,
      $scope,
      $rootScope,
      $window,
      $i18next,
      ConfigService,
      InsideIframeService,
      Authmethod,
      I18nOverride
    ) {
      $("#theme")
        .attr("href", "election/themes/" + ConfigService.theme + "/app.min.css");
      
      $scope.layout = "default";
      $scope.statePrefix = "election.public.show.home";
      $scope.inside_iframe = InsideIframeService();
      $scope.legal_html_include = ConfigService.legal_html_include;
      
      // This is used to enable custom css overriding
      $scope.allowCustomElectionThemeCss = ConfigService.allowCustomElectionThemeCss;

      /**
       * Shows the election results of the given election. Called by the
       * children elections directive when a children election is clicked.
       * 
       * @param {number} electionId election whose results should be shown.
       */
      $scope.autoreloadResultsTimer = null;
      $scope.alreadyReloaded = null;

      function reloadTranslations(force) {
        function reloadInner() {
          var election = $scope.election;

          if ($scope.alreadyReloaded === election.id) {
            $i18next.reInit();
            return;
          } else {
            $scope.alreadyReloaded = election.id;
          }

          // reset $window.i18nOverride
          var overrides = (
            election &&
            election.presentation &&
            election.presentation.i18n_override
          ) ? election.presentation.i18n_override : null;

          var languagesConf = (
            election &&
            election.presentation &&
            election.presentation.i18n_languages_conf
          ) ? election.presentation.i18n_languages_conf : null;

          $i18next.options.useLocalStorage = true;
          I18nOverride(
            /* overrides = */ overrides,
            /* force = */ force,
            /* languagesConf = */ languagesConf
          );
        }
        function timeoutWrap() {
          console.log("timeoutWrap");
          var election = $scope.election;
          $i18next.options.useLocalStorage = true;

          if (election && $scope.alreadyReloaded === election.id) {
            return;
          }
          if (!election) {
            console.log("timeoutWrap: delaying for election..");
            setTimeout(timeoutWrap, 200);
            return;
          }
          var languagesConf = (
            election &&
            election.presentation &&
            election.presentation.i18n_languages_conf
          ) ? election.presentation.i18n_languages_conf : null;

          var languageNotFound = false;
          if (languagesConf && languagesConf.available_languages) {
            _.each(languagesConf.available_languages, function (langCode) {
              if (!window.i18nOriginal || !(langCode in window.i18nOriginal)) {
                console.log("bundle not found for lang=" + langCode);
                window.i18n.preload([langCode]);
                languageNotFound = true;
              }
            });
          }
          if (languageNotFound) {
            console.log("timeoutWrap: delaying for bundle..");
            setTimeout(timeoutWrap, 200);
            return;
          }
          reloadInner();
        }
        timeoutWrap();
      }

      $scope.autoReloadReceive = function (value)
      {
        var presentation = value.data.payload.configuration.presentation;

        if (
          presentation &&
          presentation.theme &&
          presentation.theme !== ConfigService.theme
        ) {
          $("#theme")
          .attr("href", "election/themes/" + presentation.theme + "/app.min.css");
          ConfigService.theme = presentation.theme;
        }

        // if state is not started but we are in login, redirect to default url
        if (
          $state.current.name === "election.public.show.login" &&
          !_.contains(
            ['started', 'resumed'],
            value.data.payload.state
          ) && 
          $window.location.pathname !== ConfigService.defaultRoute
        ) {
          if (
            !presentation ||
            !presentation.extra_options ||
            !presentation.extra_options.disable__public_home
          ) {
            $window.location.href = '/election/' + $stateParams.id + '/public/home';
          } else {
            window.location.href = ConfigService.defaultRoute;
          }
          return;
        }

        // if we are showing the election home but it is disabled then perform
        // a redirect
        if (
          $state.current.name.startsWith("election.public.show.home") &&
          presentation &&
          presentation.extra_options &&
          presentation.extra_options.disable__public_home
        ) {
          if ("smart-link" === $scope.auth_method) {
            window.location.href = ConfigService.defaultRoute;
          } else {
            $window.location.href = '/election/' + $stateParams.id + '/public/login';
          }
          return;
        }

        reloadTranslations(false);

        var newJson = angular.fromJson(value.data.payload.results);
        if (!$scope.results || angular.toJson($scope.results) !== angular.toJson(newJson)) {
          $scope.results = newJson;
        }

        // reload every 15 seconds
        $scope.autoreloadResultsTimer = setTimeout(
          function() 
          {
            $scope.autoreloadResults(value.data.payload.id); 
          }, 
          15000
        );
      };

      $scope.autoreloadResults = function(electionId) 
      {
        clearTimeout($scope.autoreloadResultsTimer);
        if (!electionId)
        {
          return;
        }

        $http
          .get(ConfigService.baseUrl + "election/" + electionId)
          .then($scope.autoReloadReceive)
          // on error, like parse error or 404
          .catch(
            function (error)
            {
              $state.go("election.public.error");
            }
          );
      };

      // get election config
      var extra_data  = {};
      
      $http
        .get(ConfigService.authAPI + "legal/" + $stateParams.id + "/")
        .then(
          function(value) 
          {
            if(value.data) 
            {
              extra_data = value.data;
            }
            return $http.get(ConfigService.baseUrl + "election/" + $stateParams.id);
          }
        )
        .then(
          function(value)
          {
            $scope.election = value.data.payload.configuration;
            $scope.election.extra_data = extra_data;
            $scope.layout = "default";
            $scope.electionState = value.data.payload.state;

            $http
            .get(ConfigService.authAPI + "auth-event/" + $stateParams.id + "/")
            .then(
              function(authEventResponse)
              {
                $scope.election.children_election_info = authEventResponse.data.events.children_election_info;
                $scope.auth_method = authEventResponse.data.events.auth_method;
                $scope.autoReloadReceive(value);
              }
            );
          }
        )
        // on error, like parse error or 404
        .catch(
          function (error)
          {
            $state.go("election.public.error");
          }
        );

      Authmethod
        .viewEvent($stateParams.id)
        .then(
          function onSuccess(response)
          {
            if (response.data.status === "ok")
            {
              $scope.authEvent = response.data.events;
            }
          }
        );

      /**
       * Saves the state of the button to show or hide the results to view 
       * selector.
       */
      $scope.showSelectResults = true;


      $scope.toggleShowSelectResults = function () 
      {
        $scope.showSelectResults = !$scope.showSelectResults;
      };

  }
);
