angular.module('avAdmin')
  .directive(
    'avAdminElcensus',
    function(
      $window,
      $state,
      ElectionsApi,
      Authmethod,
      $modal,
      MustExtraFieldsService,
      $filter,
      $stateParams,
      $timeout)
    {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
      scope.census = ['open', 'close'];
      scope.election = ElectionsApi.currentElection;
      scope.newcensus = {};
      scope.electionLoaded = false;
      scope.reloadingCensus = false;
      scope.loading = false;
      scope.nomore = false;
      scope.error = null;
      scope.page = 1;
      scope.msg = null;
      scope.filterStr = "";
      scope.$filter = $filter;
      scope.filterTimeout = null;
      scope.filterOptions = {};
      scope.resizeSensor = null;

      function newElection() {
        return !$stateParams.id;
      }

      scope.commands = [
        {
          i18nString: 'addPersonAction',
          iconClass: 'fa fa-plus',
          actionFunc: function() { return scope.addPersonModal(); },
          enableFunc: function() { return true; }
        },
        {
          i18nString: 'addCsvAction',
          iconClass: 'fa fa-plus',
          actionFunc: function() { return scope.addCsvModal(); },
          enableFunc: function() { return true; }
        },
        {
          i18nString: 'exportCensusAction',
          iconClass: 'fa fa-download',
          actionFunc: function() { return scope.exportCensusModal(); },
          enableFunc: function() {
            return (
              scope.election && scope.election.census &&
              scope.election.census.voters &&
              scope.election.census.voters.length);
          }
        },
        {
          i18nString: 'selectAllShownAction',
          iconClass: 'fa fa-check-square-o',
          actionFunc: function() { return scope.selectQueried(true); },
          enableFunc: function() { return scope.shown().length > 0; }
        },
        {
          i18nString: 'deselectAllShownAction',
          iconClass: 'fa fa-square-o',
          actionFunc: function() { return selectQueried(false); },
          enableFunc: function() { return scope.numSelected(scope.shown()) > 0; }
        },
        {
          i18nString: 'activateAction',
          iconClass: 'fa fa-user',
          actionFunc: function() {
            $modal.open({
              templateUrl: "avAdmin/admin-directives/elcensus/confirm-activate-people-modal.html",
              controller: "ConfirmActivatePeopleModal",
              size: 'lg',
              resolve: {
                election: function () { return scope.election; },
                numSelectedShown: function() {
                  return scope.numSelected(scope.shown());
                }
              }
            }).result.then(scope.activateSelected);
          },
          enableFunc: function() {
            return scope.election && scope.election.id && scope.numSelected(scope.shown()) > 0;
          }
        },
        {
          i18nString: 'deactivateAction',
          iconClass: 'fa fa-user-times',
          actionFunc: function() {
            $modal.open({
              templateUrl: "avAdmin/admin-directives/elcensus/confirm-deactivate-people-modal.html",
              controller: "ConfirmDeactivatePeopleModal",
              size: 'lg',
              resolve: {
                election: function () { return scope.election; },
                numSelectedShown: function() {
                  return scope.numSelected(scope.shown());
                }
              }
            }).result.then(scope.deactivateSelected);
          },
          enableFunc: function() {
            return scope.election && scope.election.id && scope.numSelected(scope.shown()) > 0;
          }
        },
        {
          i18nString: 'removeCensusAction',
          iconClass: 'fa fa-trash-o',
          actionFunc: function() {
            $modal.open({
              templateUrl: "avAdmin/admin-directives/elcensus/confirm-remove-people-modal.html",
              controller: "ConfirmRemovePeopleModal",
              size: 'lg',
              resolve: {
                election: function () { return scope.election; },
                numSelectedShown: function() {
                  return scope.numSelected(scope.shown());
                }
              }
            }).result.then(scope.removeSelected);
          },
          enableFunc: function() { return scope.numSelected(scope.shown()) > 0; }
        },
        {
          i18nString: 'sendAuthCodesAction',
          iconClass: 'fa fa-paper-plane-o',
          actionFunc: function() { return sendAuthCodesSelected(); },
          enableFunc: function() {
            return scope.election.status === 'started' && scope.numSelected(scope.shown()) > 0;
          }
        }
      ];

      function addToCensus(textarea) {
          var el = scope.election;
          var cs = [];
          if (!el.id) {
            cs = el.census.voters;
            cs.push({selected: false, vote: false, username: "", metadata: scope.newcensus});
          } else {
            cs.push({selected: false, vote: false, username: "", metadata: scope.newcensus});

            var csExport = _.map(cs, function (i) { return i.metadata; });
            scope.loading = true;
            Authmethod.addCensus(el.id, csExport, 'disabled')
              .success(function(r) {
                scope.loading = false;
                scope.msg = "avAdmin.census.censusadd";
                scope.reloadCensus();
              })
              .error(function(error) {
                scope.loading = false;
                scope.error = error.error;
              });
          }
          scope.newcensus = {};
      }

      function delVoter(index) {
          var el = scope.election;
          var cs = el.census.voters;
          el.census.voters = cs.slice(0, index).concat(cs.slice(index+1,cs.length));
      }

      function massiveAdd(textarea) {
          var el = scope.election;
          var cs;
          if (!el.id) {
            cs = el.census.voters;
          } else {
            cs = [];
          }

          var fields = el.census.extra_fields;

          var lines = textarea.split("\n");
          lines.forEach(function(l) {
              var lf = l.split(";");
              var nv = {};
              fields.forEach(function(f, i) { nv[f.name] = lf[i]; });
              if (nv.tlf) {
                nv.tlf.replace(" ", "");
              }
              cs.push({selected: false, vote: false, username: "", metadata: nv});
          });

          if (!!el.id) {
            var csExport = _.map(cs, function (i) { return i.metadata; });
            scope.loading = true;
            Authmethod.addCensus(el.id, csExport, 'disabled')
              .success(function(r) {
                scope.loading = false;
                scope.msg = "avAdmin.census.censusadd";
                scope.reloadCensus();
              })
              .error(function(error) {
                scope.loading = false;
                scope.error = error.error;
              });
          }
      }

      function exportCensusModal() {
        $modal.open({
          templateUrl: "avAdmin/admin-directives/elcensus/export-all-census-modal.html",
          controller: "ExportAllCensusModal",
          size: 'lg',
          resolve: {
            election: function () { return scope.election; }
          }
        }).result.then(exportCensus);
      }

      function exportCensus(el) {
        var cs = el.census.voters;
        var csExport = _.map(cs, function (i) {
          var ret = angular.copy(i.metadata);
          ret.vote = i.vote;
          ret.voterid = i.username;
          return ret;
        });
        var text = $window.Papa.unparse(angular.toJson(csExport));
        var blob = new $window.Blob([text], {type: "text/csv"});
        $window.saveAs(blob, el.id + "-census"+".csv");
        return false;
      }

      function removeSelected() {
        var selectedList = scope.selected(scope.shown());
        if (!scope.election.id) {
          _.each(selectedList, function (selected) {
            var i = scope.election.census.voters.indexOf(selected);
            delVoter(i);
          });
        } else {
          var user_ids = _.pluck(selectedList, "id");
          Authmethod.removeUsersIds(scope.election.id, scope.election, user_ids)
          .success(function(r) {
            scope.loading = false;
            scope.msg = "avAdmin.census.removedCensusSuccessfully";
            scope.reloadCensus();
          })
          .error(function(error) { scope.loading = false; scope.error = error.error; });
        }
        return false;
      }

      function activateSelected() {
        var selectedList = scope.selected(scope.shown());
          var user_ids = _.pluck(selectedList, "id");
          Authmethod.activateUsersIds(scope.election.id, scope.election, user_ids)
          .success(function(r) {
            scope.loading = false;
            scope.msg = "avAdmin.census.activatedCensusSuccessfully";
            scope.reloadCensus();
          })
          .error(function(error) { scope.loading = false; scope.error = error.error; });
        return false;
      }

      function deactivateSelected() {
        var selectedList = scope.selected(scope.shown());
          var user_ids = _.pluck(selectedList, "id");
          Authmethod.deactivateUsersIds(scope.election.id, scope.election, user_ids)
          .success(function(r) {
            scope.loading = false;
            scope.msg = "avAdmin.census.activatedCensusSuccessfully";
            scope.reloadCensus();
          })
          .error(function(error) { scope.loading = false; scope.error = error.error; });
        return false;
      }

      function sendAuthCodes(user_ids) {
        scope.loading = true;
        Authmethod.sendAuthCodes(scope.election.id, scope.election, user_ids)
          .success(function(r) {
            scope.loading = false;
            scope.msg = "avAdmin.census.sentCodesSuccessfully";
          })
          .error(function(error) { scope.loading = false; scope.error = error.error; });
      }

      function sendAuthCodesSelected() {
        var selectedList = scope.selected(scope.shown());
        var user_ids = _.pluck(selectedList, "id");
        $modal.open({
          templateUrl: "avAdmin/admin-directives/dashboard/send-auth-codes-modal.html",
          controller: "SendAuthCodesModal",
          size: 'lg',
          resolve: {
            election: function () { return scope.election; },
            user_ids: function() { return user_ids; }
          }
        }).result.then(sendAuthCodes);
        return false;
      }

      function selectQueried(selectStatus) {
        _.each(scope.election.census.voters,
          function (i) {
            i.selected = selectStatus;
          });
      }

      function addCsvModal() {
        $modal.open({
          templateUrl: "avAdmin/admin-directives/elcensus/add-csv-modal.html",
          controller: "AddCsvModal",
          size: 'lg',
          resolve: {
            election: function () { return scope.election; }
          }
        }).result.then(function(textarea) {
          scope.massiveAdd(textarea);
        });
      }

      function addPersonModal() {
        $modal.open({
          templateUrl: "avAdmin/admin-directives/elcensus/add-person-modal.html",
          controller: "AddPersonModal",
          size: 'lg',
          resolve: {
            election: function () { return scope.election; },
            newcensus: function() { return scope.newcensus; }
          }
        }).result.then(function(textarea) {
          scope.addToCensus(textarea);
        });
      }

      /**
       * Load more census in infinite scrolling mode
       */
      function loadMoreCensus(reload) {
        if (!scope.electionLoaded || scope.loading || scope.nomore || newElection()) {
          if (scope.reloadingCensus) {
            scope.reloadingCensus = false;
          }
          return;
        }
        scope.loading = true;

        ElectionsApi.waitForCurrent(function () {
          ElectionsApi.getCensus(
              scope.election,
              scope.page,
              null,
              scope.filterStr,
              scope.filterOptions)
            .then(function(el) {
              scope.page += 1;
              if (scope.reloadingCensus) {
                scope.reloadingCensus = false;
              }

              if (el.data.end_index === el.data.total_count) {
                scope.nomore = true;
              }
              scope.loading = false;
            })
            .catch(function(data) {
              scope.error = data;
              scope.loading = false;
              if (scope.reloadingCensus) {
                scope.reloadingCensus = false;
              }
            });
        });
      }

      function reloadCensus() {
        scope.nomore = false;
        scope.page = 1;
        if (!scope.electionLoaded || !scope.election || !scope.election.census || !scope.election.census.voters) {
          return;
        }
        scope.reloadingCensus = true;
        scope.election.census.voters.splice(0, scope.election.census.voters.length);

        loadMoreCensus();
      }

      function filteredVoters() {
        if (!scope.election || !scope.election.census || !scope.election.census.voters) {
          return [];
        } else if (!scope.filterStr || scope.electionLoaded && !!scope.election.id) {
          return scope.election.census.voters;
        } else {
          return $filter('filter')(scope.election.census.voters, scope.filterStr);
        }
      }

      function reloadCensusDebounce() {
        $timeout.cancel(scope.filterTimeout);
        scope.filterTimeout = $timeout(function() {
          scope.reloadCensus();
        }, 500);
      }

      // debounced filter options
      scope.$watch("filterOptions", function(newOpts, oldOpts) {
        if (!scope.electionLoaded || !scope.election.id || _.isEqual(newOpts, oldOpts)) {
          return;
        }
        reloadCensusDebounce();
      }, true);

      // debounced filter
      scope.$watch("filterStr", function(newStr, oldStr) {
        if (!scope.electionLoaded || !scope.election.id || newStr === oldStr) {
          return;
        }
        reloadCensusDebounce();
      });

      // overflow-x needs to resize the height
      var ael = angular.element(".censustable");
      /* jshint ignore:start */
      scope.resizeSensor = new ResizeSensor(ael, function() {
        if (ael.width() > $(element).width()) {
          $(element).width(ael.width());
          $(element).parent().css('overflow-x', 'auto');
        }
      });
      /* jshint ignore:end */
      scope.$on("$destroy", function() { delete scope.resizeSensor; });

      angular.extend(scope, {
        addToCensus: addToCensus,
        addPersonModal: addPersonModal,
        addCsvModal: addCsvModal,
        delVoter: delVoter,
        massiveAdd: massiveAdd,
        filteredVoters: filteredVoters,
        exportCensus: exportCensus,
        exportCensusModal: exportCensusModal,
        loadMoreCensus: loadMoreCensus,
        reloadCensus: reloadCensus,
        removeSelected: removeSelected,
        activateSelected: activateSelected,
        deactivateSelected: deactivateSelected,
        selectQueried: selectQueried,
        sendAuthCodesSelected: sendAuthCodesSelected,
        newElection: newElection,
        numSelected: function (l) {
          return scope.selected(l).length;
        },
        selected: function (l) {
          if (l === undefined) {
            if (scope.election && scope.election.census && scope.election.census.voters) {
              l = scope.election.census.voters;
            } else {
              l = [];
            }
          }
          return _.filter(l, function (v) {
            return v.selected === true;
          });
        },
        shown: function(d) {
          if (scope.election && scope.election.census && scope.election.census.voters) {
            return scope.election.census.voters;
          }

          return [];
        }
      });

      function main() {
        scope.electionLoaded = true;
        scope.election = ElectionsApi.currentElection;
        MustExtraFieldsService(scope.election);
        if (scope.page === 1 && !newElection()) {
          reloadCensus();
        }
      }

      ElectionsApi.waitForCurrent(main);
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elcensus/elcensus.html'
    };
  });
