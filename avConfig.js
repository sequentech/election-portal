/*
 * ConfigService is a function that returns the configuration that exists
 * in this same file, which you might want to edit and tune if needed.
 */

var avConfigData = {
  // the base url path for ajax requests, for example for sending ballots or
  // getting info about an election. This url is usually in the form of
  // 'https://foo/api/v3/' and always ends in '/'.
  theme: "default",
  baseUrl: "https://agora/elections/api/",
  freeAuthId: 1,

  // AuthApi base url
  authAPI: "https://agora/authapi/api/",
  dnieUrl: "https://agora.dev/authapi/api/authmethod/dnie/auth/",
  // Agora Elections base url
  electionsAPI: "https://agora/elections/api/",

  authorities: ['local-auth2'],
  director: "local-auth1",

  // i18next language options, see http://i18next.com/pages/doc_init.html for
  // details
  i18nextInitOptions: {
    // Default language of the application.
    //
    // Default: 'en'
    //
    language: "es",


    // Forces a specific language.
    //
    // Default: not set
    //
    lng: "es",


    // specifies the set language query string.
    //
    // Default: "lang"
    //
    detectLngQS: 'lang',


    // Specifies what translations will be available.
    //
    // Default: ['en', 'es', 'gl', 'ca']
    //
    // lngWhitelist: ['en', 'es', 'gl', 'ca'],
  },

  // specifies the language cookie options,
  // see https://github.com/ivpusic/angular-cookie#options
  i18nextCookieOptions: {
    // Expiration in days
    //
    // Default: 360
    //
    // expires: 360,


    // Cookie domain
    //
    // Default: not set
    //
    // domain: 'foobar',
  },

  // configure $locationProvider.html5Mode
  // see https://code.angularjs.org/1.2.28/docs/guide/$location
  //
  // Default: false
  // locationHtml5mode: false,
  locationHtml5mode: true,

  // If no Route is set, this is the route that will be loaded
  //
  // Default: '/admin/login'
  defaultRoute: '/admin/login',

  timeoutSeconds: 3600,

  publicURL: "https://agora/elections/public/",

  // if we are in debug mode or not
  debug: true,

  // contact data where users can reach to a human when they need it
  contact: {
    email: "contact@example.com",
    twitter: "twitter",
    tlf: "-no tlf-"
  },

  verifier: {
    link: "",
    hash: ""
  },

  help: {
    info:""
  },

  success: {
    text: ""
  },

  tos: {
    text:"",
    tile: ""
  }
};

angular.module('avConfig', [])
  .factory('ConfigService', function() {
    return avConfigData;
  });

angular.module('avConfig')
  .provider('ConfigService', function ConfigServiceProvider() {
    _.extend(this, avConfigData);

    this.$get = [function ConfigServiceProviderFactory() {
    return new ConfigServiceProvider();
    }];
  });
