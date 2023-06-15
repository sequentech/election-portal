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

window.SequentConfigData.base = '/election';

angular.module(
  'election-portal',
  ['ui.bootstrap',
  'ui.utils',
  'ui.router',
  'ngAria',
  'ngAnimate',
  'ngResource',
  'ngCookies',
  'ipCookie',
  'ngSanitize',
  'infinite-scroll',
  'angularMoment',
  'SequentConfig',
  'SequentPluginsConfig',
  'jm.i18next',
  'avUi',
  'avRegistration',
  'avTest',
  'avElection',
  'angularFileUpload',
  'dndLists',
  'angularLoad',
  'angular-date-picker-polyfill',
  'ng-autofocus',
  'common-ui'
]);

angular.module('jm.i18next').config(function ($i18nextProvider, ConfigServiceProvider) {
  // note that we do not send the language: by default, it will try the language
  // supported by the web browser
  $("#no-js").hide();

  $i18nextProvider.options = _.extend(
    {
      useCookie: true,
      useLocalStorage: false,
      fallbackLng: 'en',
      cookieName: 'lang',
      detectLngQS: 'lang',
      lngWhitelist: ['en', 'es', 'gl', 'ca', 'nb'],
      resGetPath: '/election/locales/__lng__.json',
      defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
    },
    ConfigServiceProvider.i18nextInitOptions
  );

  // Prevent site translation if configured
  if (ConfigServiceProvider.preventSiteTranslation) {
    $('html').attr('translate', 'no');
  }
});

angular.module('election-portal').config(function($sceDelegateProvider, ConfigServiceProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(ConfigServiceProvider.resourceUrlWhitelist);
});

angular.module('election-portal').config(
  function(
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    $locationProvider,
    ConfigServiceProvider)
  {
    // CSRF verification
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $urlRouterProvider.otherwise(ConfigServiceProvider.defaultRoute);

    // use the HTML5 History API
    $locationProvider.html5Mode(ConfigServiceProvider.locationHtml5mode);

    /* App states and urls are defined here */
    $stateProvider
      .state('election', {
        abstract: true,
        url: '/election',
        template: '<div ui-view></div>'
      })
      .state('election.login_openid_connect_redirect', {
        url: '/login-openid-connect-redirect',
        templateUrl: 'avRegistration/login-controller/login-controller.html',
        controller: "LoginController",
        params: {
          isOpenId: true
        }
      })
      .state('election.public', {
        url: '/{id:[0-9]{1,15}}/public',
        templateUrl: 'avElection/public-controller/public-controller.html',
        controller: "PublicController"
      })
      .state('election.public.loading', {
        templateUrl: 'avElection/public-controller/loading.html'
      })
      .state('election.public.error', {
        templateUrl: 'avElection/public-controller/error.html'
      })
      .state('election.public.show', {
        templateUrl: 'avElection/public-controller/show.html'
      })
      .state('election.public.show.home', {
        url: '/home',
        templateUrl: 'avElection/public-controller/home.html'
      })
      .state('election.public.show.view', {
        url: '/view/:name',
        templateUrl: 'avElection/public-controller/view_page.html'
      })
      .state('election.public.show.auths', {
        url: '/authorities',
        templateUrl: 'avElection/public-controller/authorities.html'
      })
      .state('election.public.show.censusQuery', {
        url: '/census-query',
        templateUrl: 'avElection/public-controller/census_query.html'
      })
      .state('election.public.show.verify-results', {
        url: '/verify-results',
        templateUrl: 'avElection/public-controller/verify_results.html'
      })
      .state('election.public.show.ballot-locator', {
        url: '/ballot-locator',
        templateUrl: 'avElection/ballot-locator-controller/ballot-locator-controller.html',
        controller: "BallotLocatorController"
      })
      .state('election.public.show.ballot-locator-included', {
        url: '/ballot-locator/:locator',
        templateUrl: 'avElection/ballot-locator-controller/ballot-locator-controller.html',
        controller: "BallotLocatorController"
      })
      .state('election.public.show.home.simple', {
        template: '<div ave-simple-question></div>'
      })
      .state('election.public.show.home.unknown', {
        templateUrl: 'avElection/question-results-directive/unknown.html'
      })
      .state('election.public.show.home.plurality-at-large', {
        template: '<div av-plurality-at-large-results></div>',
      })
      .state('election.public.show.home.borda', {
        template: '<div av-borda-results></div>',
      })
      .state('election.public.show.register', {
        url: '/register',
        templateUrl: 'avRegistration/register-controller/register-controller.html',
        controller: "RegisterController"
      })
      .state('election.public.show.login', {
        url: '/login',
        templateUrl: 'avRegistration/login-controller/login-controller.html',
        controller: "LoginController"
      })
      .state('election.public.show.login_email', {
        url: '/login/:email',
        templateUrl: 'avRegistration/login-controller/login-controller.html',
        controller: "LoginController"
      })
      .state('election.public.show.login_email_code', {
        url: '/login/:email/:code',
        templateUrl: 'avRegistration/login-controller/login-controller.html',
        controller: "LoginController"
      })
      .state('election.public.show.login_with_code', {
        url: '/login-with-code/:username',
        templateUrl: 'avRegistration/login-controller/login-controller.html',
        controller: "LoginController",
        params: {
          withCode: true
        }
      })
      .state('election.public.show.login_with_code', {
        url: '/login-alt/:altmethod',
        templateUrl: 'avRegistration/login-controller/login-controller.html',
        controller: "LoginController",
        params: {
          withAltMethod: true
        }
      })
      .state('election.public.show.otl', {
        url: '/otl/:otlSecret',
        templateUrl: 'avRegistration/login-controller/login-controller.html',
        controller: "LoginController",
        params: {
          isOtl: true
        }
      })
      .state('election.public.show.logout', {
        url: '/logout',
        controller: "LogoutController"
      })
      .state('election.public.show.legal', {
        url: '/legal',
        templateUrl: 'avElection/public-controller/legal.html',
        controller: "PublicController"
      })
      .state('election.public.show.documentation', {
        url: '/documentation',
        template: '<div class="col-xs-12 top-section" documentation-directive></div>'
      })
      .state('election.results', {
        url: '/:id/results',
        templateUrl: 'avElection/results-controller/results-controller.html',
        controller: "ResultsController"
      })
      .state('election.results.loading', {
        templateUrl: 'avElection/results-controller/loading.html'
      })
      .state('election.results.error', {
        templateUrl: 'avElection/results-controller/error.html'
      })
      .state('election.results.show', {
        templateUrl: 'avElection/results-controller/show.html'
      })
      .state('election.results.show.unknown', {
        templateUrl: 'avElection/question-results-directive/unknown.html'
      })
      .state('election.results.show.borda', {
        template: '<div av-borda-results></div>',
      })
      .state('election.results.show.plurality-at-large', {
        template: '<div av-plurality-at-large-results></div>',
      });
    $stateProvider
      .state('unit-test-e2e', {
        url: '/unit-test-e2e',
        templateUrl: 'test/unit_test_e2e.html',
        controller: "UnitTestE2EController"
      });
});

angular.module('election-portal').run(function($http, $rootScope, $window, ConfigService) {

  $rootScope.electionsTitle = ConfigService.webTitle;
  $rootScope.safeApply = function(fn) {
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams) {
      console.log("change start from " + fromState.name + " to " + toState.name);
      // redirect to /admin/login if this login link is invalid
      if (_.contains (['election.public.show.login',
                       'election.public.show.login_email_code',
                       'election.public.show.login_email'],
                      toState.name) &&
          ConfigService.freeAuthId+"" === toParams.id)
      {
        $window.location.href = "/admin/login";
      }
      $("#angular-preloading").show();
    });
  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      console.log("change success");
      $("#angular-preloading").hide();
    });
});


/*
This directive allows us to pass a function in on an enter key to do what we want.
 */
angular.module('election-portal').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

/**
 * Truncate Filter
 * @Param text
 * @Param length, default is 10
 * @Param end, default is "..."
 * @return string
 */
angular.module('election-portal').filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length)) {
                length = 10;
            }

            if (end === undefined) {
                end = "...";
            }

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });
