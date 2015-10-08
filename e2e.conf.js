/* jshint ignore:start */
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  frameworks: ['jasmine'],
  specs: [
    'avAdmin/new-election-send-webspec.js',
    'avUi/affix-bottom-directive-webspec.js',
    'avUi/affix-top-directive-webspec.js',
    'avUi/collapsing-directive-webspec.js',
    'test/dynamic-directive-webspec.js'
  ],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },
  baseUrl: 'http://localhost:9001'
}
/* jshint ignore:end */
