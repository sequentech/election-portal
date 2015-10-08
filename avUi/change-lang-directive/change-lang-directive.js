/*
 * Simple change lang directive, that can be used in the navbar as a list
 * element:
 * <li class="dropdown" av-change-lang></li>
 */
angular.module('avUi')
  .directive('avChangeLang', function($i18next, ipCookie, angularLoad, amMoment, ConfigService) {
    function link(scope, element, attrs) {
      scope.deflang = window.i18n.lng();
      scope.langs =  $i18next.options.lngWhitelist;

      // Changes i18n to a specific language, setting also a cookie for
      // remembering it, and updating all the translations instantly.
      //
      // Triggered when the user clicks and selects a language.
      scope.changeLang = function(lang) {
        $i18next.options.lng = lang;
        console.log("setting cookie");
        ipCookie(
          "lang",
          lang,
          _.extend({expires: 360}, ConfigService.i18nextCookieOptions));
        scope.deflang = lang;

        // async load moment i18n
        angularLoad
          .loadScript('/locales/moment/' + lang + '.js')
          .then(function () {
            amMoment.changeLocale(lang);
          });
      };
    }

    return {
      restrict: 'AE',
      scope: {},
      link: link,
      templateUrl: 'avUi/change-lang-directive/change-lang-directive.html'
    };
  });