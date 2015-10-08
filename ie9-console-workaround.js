/*
 * IE9 console workaround
 * The console object is only exposed on Internet Explorer 9
 * after opening the developer tools (F12)
 */

if (!window.console) {
  var console = {
    log: function() {},
    warn: function() {},
    error: function() {},
    time: function() {},
    timeEnd: function() {}
  };
}
