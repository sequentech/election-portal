/**
 * This file is part of common-ui.
 * Copyright (C) 2015-2016  Sequent Tech Inc <legal@sequentech.io>

 * common-ui is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License.

 * common-ui  is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with common-ui.  If not, see <http://www.gnu.org/licenses/>.
**/

/*
 * ConfigService is a function that returns the configuration that exists
 * in this same file, which you might want to edit and tune if needed.
 */

var SEQUENT_CONFIG_VERSION = '7.1.1';

var SequentConfigData = {
  // the base url path for ajax requests, for example for sending ballots or
  // getting info about an election. This url is usually in the form of
  // 'https://foo/api/v3/' and always ends in '/'.
  base: '',
  theme: "default",
  baseUrl: "https://sequent/elections/api/",
  freeAuthId: 1,

  // Webpage title
  webTitle: "Sequent Tech",

  // Show 'Success Action' tab in admin sequent_ui
  showSuccessAction: false,

  // AuthApi base url
  authAPI: "https://sequent/iam/api/",
  dnieUrl: "https://sequent.dev/iam/api/authmethod/dnie/auth/",
  // Agora Elections base url
  electionsAPI: "https://sequent/elections/api/",

  // Agora Admin help url
  helpUrl: "https://sequentech.io/help",

  authorities: ['local-auth2'],
  director: "local-auth1",

  // For admins:
  // Allow editing the json description of the election before creating it
  // Allowed values: true|false
  allowEditElectionJson: true,

  // Allow admin users registration
  // Allowed values: true|false
  allowAdminRegistration: false,

  // show the documentation links after successfully casting a vote
  // allowed values: true| false
  showDocOnVoteCast: false,

  resourceUrlWhitelist: [
    // Allow same origin resource loads.
    'self',

    // Allow loading from our assets domain.  Notice the difference between * and **.
    // Uncomment the following to allow youtube videos
    //
    // 'https://www.youtube.com/**',
    // 'https://youtube.com/**'
  ],

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

  publicURL: "https://sequent/elections/public/",

  // if we are in debug mode or not
  debug: true,

  // contact data where users can reach to a human when they need it
  contact: {
    // Support contact email displayed in the footer links
    email: "contact@example.com",
    // Sales contact email displayed in the footer links
    sales: "sales@example.com",
    tlf: "-no tlf-"
  },

  // social networks footer links
  social: {
      facebook: "https://www.facebook.com/AgoraVoting",
      twitter: "https://twitter.com/sequent",
      twitterHandle: "sequent",
      googleplus: "https://plus.google.com/101939665794445172389/posts",
      youtube: "https://www.youtube.com/results?search_query=Agora+Voting",
      github: "https://github.com/sequent/"
  },

  // technology footer links
  technology: {
    aboutus: "https://sequentech.io/#aboutus",
    pricing: "https://sequentech.io/#pricing",
    overview: "https://sequentech.io/overview/",
    solutions: "https://sequentech.io/solutions/",
    documentation: "https://bit.ly/avguiadeuso"
  },

  // legality footer links
  legal: {
    terms_of_service: "https://sequentech.io/tos/",
    cookies: "https://sequentech.io/cookies/",
    privacy: "https://sequentech.io/privacy/",
    security_contact: "https://sequentech.io/security_contact/",
    community_website: "https://sequent.org"
  },

  documentation: {
    show_help: true,
    faq: 'https://sequentech.io/doc/en/',
    overview: 'https://sequentech.io/overview/',
    technical: 'https://sequentech.io/static/generic_tech_overview_20_08_15.pdf',
    security_contact: "https://sequentech.io/security_contact/"
  },

  documentation_html_include: '',

  legal_html_include: '',

  // Details pertaining to the organization that runs the software
  organization: {
    // Name of the organization, appears in the logo mouse hover, in the login
    // page ("Login into __NAME__ admin account"), in the poweredBy, etc
    orgName: 'Sequent Tech',

    // Subtitle of the organization, used in the ballot ticket PDF
    orgSubtitle: '',

    //  Big logo of the organization, used in the ballot ticket PDF
    orgBigLogo: '',

    // URL that the logo links to
    orgUrl: 'https://sequentech.io'
  },

  verifier: {
    link: "",
    hash: ""
  },

  success: {
    text: ""
  },

  tos: {
    text:"",
    title: ""
  },

  mainVersion: '7.1.1',
  repoVersions: []
};

angular.module('SequentConfig', [])
  .factory('ConfigService', function() {
    return SequentConfigData;
  });

angular.module('SequentConfig')
  .provider('ConfigService', function ConfigServiceProvider() {
    _.extend(this, SequentConfigData);

    this.$get = [function ConfigServiceProviderFactory() {
    return new ConfigServiceProvider();
    }];
  });
