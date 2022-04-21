var SEQUENT_PLUGINS_CONFIG_VERSION = '6.0.1';
angular.module('SequentPluginsConfig', [])
  .factory('PluginsConfigService', function() {
    return {};
  });

angular.module('SequentPluginsConfig')
  .provider('PluginsConfigService', function PluginsConfigServiceProvider() {
    _.extend(this, {});

    this.$get = [function PluginsConfigServiceProviderFactory() {
    return new PluginsConfigServiceProvider();
    }];
   });