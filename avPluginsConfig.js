var AV_PLUGINS_CONFIG_VERSION = '5.0.3';
angular.module('avPluginsConfig', [])
  .factory('PluginsConfigService', function() {
    return {};
  });

angular.module('avPluginsConfig')
  .provider('PluginsConfigService', function PluginsConfigServiceProvider() {
    _.extend(this, {});

    this.$get = [function PluginsConfigServiceProviderFactory() {
    return new PluginsConfigServiceProvider();
    }];
   });