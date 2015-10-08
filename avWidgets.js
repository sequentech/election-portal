/* jshint ignore:start */
(function () {
  function createElement(name, attrs) {
    var el = document.createElement(name);
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    return el;
  }

  function processLinks(className, callback) {
    var links = document.getElementsByClassName(className);
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.getAttribute("href");
      if (callback !== undefined) {
        callback(link, i, className);
      }
      var iframe = createElement("iframe", {
        "class": className + "-iframe",
        "src": href,
        "style": "border: 0; width: 100%; height: 100%",
        "seamless": ""
      });
      link.parentNode.insertBefore(iframe, link);
      link.parentNode.removeChild(link);
    }
  }

  // generic interface for html5 messaging api
  function requestAuthorization(e) {
    var reqAuth = "avRequestAuthorization:";
    if (e.data.substr(0, reqAuth.length) !== reqAuth) {
      return;
    }

    function callback(khmac) {
      e.source.postMessage('avPostAuthorization:' + khmac, '*');
    }

    var args = [
      JSON.parse(e.data.substr(reqAuth.length, e.data.length)),
      callback
    ];
    window[window.avRequestAuthorizationFuncName].apply(window, args);
  }
  window.addEventListener('message', requestAuthorization, false);

  // convert links into widgets
  processLinks("agoravoting-voting-booth", function (link) {
    var funcName = link.getAttribute("data-authorization-funcname");
    window.avRequestAuthorizationFuncName = funcName;
  });
  processLinks("agoravoting-ballot-locator");
  processLinks("agoravoting-results");
})();
/* jshint ignore:end */