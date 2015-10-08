angular.module('avAdmin')
  .directive('avAdminCreate', function($q, Authmethod, ElectionsApi, $state, $i18next, $filter, ConfigService, CheckerService) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var adminId = ConfigService.freeAuthId;
        scope.creating = false;
        scope.log = '';
        scope.createElectionBool = true;

        if (ElectionsApi.currentElections.length === 0 && !!ElectionsApi.currentElection) {
          scope.elections = [ElectionsApi.currentElection];
        } else {
          scope.elections = ElectionsApi.currentElections;
          ElectionsApi.currentElections = [];
        }

        function logInfo(text) {
          scope.log += "<p>" + text + "</p>";
        }

        function logError(text) {
          scope.log += "<p class=\"text-brand-danger\">" + text + "</p>";
        }

        /*
         * Checks elections for errors
         */
        var checks = [
          {
            check: "array-group-chain",
            prefix: "election-",
            append: {key: "eltitle", value: "$value.title"},
            checks: [
              {check: "is-array", key: "questions", postfix: "-questions"},
              {check: "array-length", key: "questions", min: 1, max: 40, postfix: "-questions"},
              {check: "array-length", key: "description", min: 0, max: 3000, postfix: "-description"},
              {check: "array-length", key: "title", min: 0, max: 3000, postfix: "-title"},
              {check: "is-string", key: "description", postfix: "-description"},
              {
                check: "lambda",
                key: "census",
                validator: function (census) {
                  var authAction = census.config['authentication-action'];
                  if (authAction.mode !== 'go-to-url') {
                    return true;
                  }

                  var urlRe = /^(https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
                  return urlRe.test(authAction['mode-config'].url);
                },
                postfix: "-success-action-url-mode"
              },
              {check: "is-string", key: "title", postfix: "-title"},
              {
                check: "array-key-group-chain",
                key: "questions",
                append: {key: "qtitle", value: "$value.title"},
                prefix: "question-",
                checks: [
                  {check: "is-int", key: "min", postfix: "-min"},
                  {check: "is-int", key: "max", postfix: "-max"},
                  {check: "is-int", key: "num_winners", postfix: "-num-winners"},
                  {check: "is-array", key: "answers", postfix: "-answers"},
                  {check: "array-length", key: "answers", min: 1, max: 10000, postfix: "-answers"},
                  {check: "int-size", key: "min", min: 0, max: "$value.max", postfix: "-min"},
                  {check: "is-string", key: "description", postfix: "-description"},
                  {check: "array-length", key: "description", min: 0, max: 3000, postfix: "-description"},
                  {check: "is-string", key: "title", postfix: "-title"},
                  {check: "array-length", key: "title", min: 0, max: 3000, postfix: "-title"},
                  {
                    check: "int-size",
                    key: "max",
                    min: "$value.min",
                    max: "$value.answers.length",
                    postfix: "-max"
                  },
                  {
                    check: "int-size",
                    key: "num_winners",
                    min: 1,
                    max: "$value.answers.length",
                    postfix: "-num-winners"
                  },
                  {
                      check: "array-key-group-chain",
                      key: "answers",
                      append: {key: "atext", value: "$value.text"},
                      prefix: "answer-",
                      checks: [
                        {
                          check: "is-string",
                          key: "text",
                          postfix: "-text"
                        },
                        {
                          check: "is-string",
                          key: "details",
                          postfix: "-details"
                        },
                        {
                          check: "is-string",
                          key: "category",
                          postfix: "-category"
                        },
                        {
                          check: "array-length",
                          key: "details",
                          min: 0,
                          max: 3000,
                          postfix: "-details"
                        },
                        {
                          check: "array-length",
                          key: "text",
                          min: 1,
                          max: 3000,
                          postfix: "-text"
                        },
                        {
                          check: "array-length",
                          key: "category",
                          min: 0,
                          max: 300,
                          postfix: "-category"
                        },
                      ]
                  }
                ]
              }
            ]
          }
        ];

        scope.errors = [];
        CheckerService({
          checks: checks,
          data: scope.elections,
          onError: function (errorKey, errorData) {
            scope.errors.push({
              data: errorData,
              key: errorKey
            });
          }
        });

        function createAuthEvent(el) {
            console.log("creating auth event for election " + el.title);
            var deferred = $q.defer();
            // Creating the authentication
            logInfo($i18next('avAdmin.create.creating', {title: el.title}));

            // sanitize some unneeded values that might still be there. This
            // needs to be done because how we use ng-model
            if (el.census.config.subject && el.census.auth_method !== 'email') {
              delete el.census.config.subject;
            }
            var authAction = el.census.config['authentication-action'];
            if (authAction.mode === 'vote') {
              authAction["mode-config"] = null;
            }

            var d = {
                auth_method: el.census.auth_method,
                census: el.census.census,
                auth_method_config: el.census.config,
                extra_fields: []
            };

            d.extra_fields = _.filter(el.census.extra_fields, function(ef) {
              var must = ef.must;
              delete ef.disabled;
              delete ef.must;

              // only add regex if it's filled and it's a text field
              if (!angular.isUndefined(ef.regex) &&
                (!_.contains(['int', 'text'], ef.type) || $.trim(ef.regex).length === 0)) {
                delete ef.regex;
              }

              if (_.contains(['bool', 'captcha'], ef.type)) {
                delete ef.min;
                delete ef.max;
              } else {
                if (!!ef.min) {
                  ef.min = parseInt(ef.min);
                }
                if (!!ef.max) {
                  ef.max = parseInt(ef.max);
                }
              }
              return !must;
            });

            Authmethod.createEvent(d)
                .success(function(data) {
                    el.id = data.id;
                    deferred.resolve(el);
                }).error(deferred.reject);
            return deferred.promise;
        }

        function addCensus(el) {
            console.log("adding census for election " + el.title);
            var deferred = $q.defer();
            // Adding the census
            logInfo($i18next('avAdmin.create.census', {title: el.title, id: el.id}));
            var voters = _.map(el.census.voters, function (i) { return i.metadata; });
            Authmethod.addCensus(el.id, voters, 'disabled')
                .success(function(data) {
                    deferred.resolve(el);
                }).error(deferred.reject);
            return deferred.promise;
        }

        function registerElection(el) {
            console.log("registering election " + el.title);

            _.each(el.questions, function (q) {
              _.each(q.answers, function (answer) {
                answer.urls = _.filter(answer.urls, function(url) { return $.trim(url.url).length > 0;});
              });
            });
            var deferred = $q.defer();
            // Registering the election
            logInfo($i18next('avAdmin.create.reg', {title: el.title, id: el.id}));
            ElectionsApi.command(el, '', 'POST', el)
                .then(function(data) { deferred.resolve(el); })
                .catch(deferred.reject);
            return deferred.promise;
        }

        function createElection(el) {
            var deferred = $q.defer();
            if (scope.createElectionBool) {
              console.log("creating election " + el.title);
              // Creating the election
              logInfo($i18next('avAdmin.create.creatingEl', {title: el.title, id: el.id}));
              ElectionsApi.command(el, 'create', 'POST', {})
                .then(function(data) { deferred.resolve(el); })
                .catch(deferred.reject);
            } else {
              deferred.resolve(el);
            }
            return deferred.promise;
        }

        function addElection(i) {
          var deferred = $q.defer();
          if (i === scope.elections.length) {
            var el = scope.elections[i - 1];
            $state.go("admin.dashboard", {id: el.id});
            return;
          }

          var promise = deferred.promise;
          promise = promise
            .then(createAuthEvent)
            .then(addCensus)
            .then(registerElection)
            .then(createElection)
            .then(function(el) {
                console.log("waiting for election " + el.title);
                waitForCreated(el.id, function () {
                  addElection(i+1);
                });
              })
              .catch(function(error) {
                scope.creating = false;
                scope.creating_text = '';
                logError(angular.toJson(error));
              });
          deferred.resolve(scope.elections[i]);
        }

        function createElections() {
            var deferred = $q.defer();
            addElection(0);
            var promise = deferred.promise;

            scope.creating = true;
        }

        function waitForCreated(id, f) {
          console.log("waiting for election id = " + id);
          ElectionsApi.getElection(id, true)
            .then(function(el) {
                var deferred = $q.defer();
                if (scope.createElectionBool && el.status === 'created' ||
                  !scope.createElectionBool && el.status === 'registered')
                {
                  f();
                } else {
                  setTimeout(function() { waitForCreated(id, f); }, 3000);
                }
            });
        }

        angular.extend(scope, {
          createElections: createElections,
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/create/create.html'
    };
  });
