angular.module(
  'agora-gui-elections',
  ['ui.bootstrap',
  'ui.utils',
  'ui.router',
  'ngAnimate',
  'ngResource',
  'ngCookies',
  'ipCookie',
  'ngSanitize',
  'infinite-scroll',
  'angularMoment',
  'avConfig',
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
  'agora-gui-common'
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
      lngWhitelist: ['en', 'es', 'gl', 'ca'],
      resGetPath: '/election/locales/__lng__.json',
      defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
    },
    ConfigServiceProvider.i18nextInitOptions);
});

angular.module('agora-gui-elections').config(function($sceDelegateProvider, ConfigServiceProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(ConfigServiceProvider.resourceUrlWhitelist);
});

angular.module('agora-gui-elections').config(
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
      .state('election.public', {
        url: '/:id/public',
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
      .state('election.public.show.verify-results', {
        url: '/verify-results',
        templateUrl: 'avElection/public-controller/verify_results.html'
      })
      .state('election.public.show.ballot-locator', {
        url: '/ballot-locator',
        templateUrl: 'avElection/public-controller/ballot_locator.html'
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
      .state('election.public.show.logout', {
        url: '/logout',
        controller: "LogoutController"
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
      .state('election.results.show.home.borda', {
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

angular.module('agora-gui-elections').run(function($http, $rootScope) {

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
angular.module('agora-gui-elections').directive('ngEnter', function () {
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
angular.module('agora-gui-elections').filter('truncate', function () {
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
