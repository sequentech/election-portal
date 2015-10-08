angular.module('avRegistration')
  .directive('avRegister', function(Authmethod, StateDataService, $parse, $state, ConfigService, $cookies, $i18next, $sce) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var autheventid = attrs.eventId;
        scope.dnieurl = ConfigService.dnieUrl + autheventid + '/';
        scope.register = {};
        scope.sendingData = false;
        scope.admin = false;

        scope.email = null;
        if (attrs.email && attrs.email.length > 0) {
          scope.email = attrs.email;
        }

        if ("admin" in attrs) {
          scope.admin = true;
        }

        scope.getLoginDetails = function (eventId) {
          if (!scope.admin) {
              return {path: 'election.public.show.login', data: {id: eventId}};
          } else {
              return {path: 'admin.login', data:{}};
          }
        };

        scope.signUp = function(valid) {
            if (!valid) {
                return;
            }
            scope.sendingData = true;
            var data = {
                'captcha_code': Authmethod.captcha_code,
            };
            _.each(scope.register_fields, function (field) {
              data[field.name] = field.value;
              if (field.name === 'email') {
                scope.email = field.value;
              }
            });
            var details;
            Authmethod.signup(data, autheventid)
                .success(function(rcvData) {
                    details = scope.getLoginDetails(autheventid);
                    if (rcvData.status === "ok") {
                        scope.user = rcvData.user;
                        StateDataService.go(details.path, details.data, data);
                        // TEST
                        scope.error = rcvData.msg || $sce.trustAsHtml($i18next('avRegistration.invalidRegisterData', {
                          url: $state.href(details.path, details.data)
                        }));
                    } else {
                        scope.sendingData = false;
                        scope.status = 'Not found';
                        scope.error = rcvData.msg || $sce.trustAsHtml($i18next('avRegistration.invalidRegisterData', {
                          url: $state.href(details.path, details.data)
                        }));
                    }
                })
                .error(function(error) {
                    details = scope.getLoginDetails(autheventid);
                    scope.sendingData = false;
                    scope.status = 'Registration error: ' + error.message;

                    if (!!error.error_codename && error.error_codename === 'invalid-dni') {
                      scope.error = $sce.trustAsHtml($i18next('avRegistration.invalidRegisterDNI'));
                    } else {
                        scope.error = error.msg || $sce.trustAsHtml($i18next('avRegistration.invalidRegisterData', {
                          url: $state.href(details.path, details.data)
                        }));
                        if (error.msg === 'Invalid captcha') {
                            Authmethod.newCaptcha();
                        }
                    }
                });
        };

        scope.goLogin = function(event) {
          console.log("goLogin");
          if (event) {
            event.preventDefault();
          }

          if (!scope.authevent) {
            return;
          }

          if (scope.authevent['id'] === ConfigService.freeAuthId+'') {
              $state.go("admin.login");
          } else {
              $state.go("election.public.show.login", {id: scope.authevent['id']});
          }
        };

        scope.apply = function(authevent) {
            scope.method = authevent['auth_method'];
            scope.name = authevent['name'];
            scope.authevent = authevent;

            // if registration is closed, redirect to login
            if (authevent['census'] !== 'open') {
              if (authevent['id'] === ConfigService.freeAuthId+'') {
                  $state.go("admin.login");
              } else {
                  $state.go("election.public.show.login", {id: authevent['id']});
              }
            }
            scope.register_fields = Authmethod.getRegisterFields(authevent);
            var fields = _.map(
              scope.register_fields,
              function (el) {
                el.value = null;
                el.disabled = false;
                if (el.type === "email" && scope.email !== null) {
                  el.value = scope.email;
                  el.disabled = true;
                }
                return el;
              });
        };

        scope.view = function(id) {
            Authmethod.viewEvent(id)
                .success(function(data) {
                    if (data.status === "ok") {
                        scope.apply(data.events);
                    } else {
                        scope.status = 'Not found';
                        document.querySelector(".input-error").style.display = "block";
                    }
                })
                .error(function(error) {
                    scope.status = 'Scan error: ' + error.message;
                    document.querySelector(".input-error").style.display = "block";
                });
        };

        scope.view(autheventid);
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avRegistration/register-directive/register-directive.html'
    };
  });
