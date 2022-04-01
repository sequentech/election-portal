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
    if (!e || !e.data || e.data.substr(0, reqAuth.length) !== reqAuth) {
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
  processLinks("sequent-voting-booth", function (link) {
    var funcName = link.getAttribute("data-authorization-funcname");
    window.avRequestAuthorizationFuncName = funcName;
  });
  processLinks("sequent-ballot-locator");
  processLinks("sequent-results");
})();
/* jshint ignore:end */