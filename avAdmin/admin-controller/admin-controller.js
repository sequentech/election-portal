angular.module('avAdmin').controller('AdminController',
  function(AdminPlugins, ConfigService, $scope, $i18next, $state, $stateParams, ElectionsApi, $compile) {
    var id = $stateParams.id;
    $scope.state = $state.current.name;
    $scope.current = null;
    $scope.noplugin = true;

    // state = admin.XXX
    $scope.shortst = $state.current.name.split(".")[1];

    // plugin stuff
    $scope.plugins = AdminPlugins.plugins;
    AdminPlugins.plugins.list.forEach(function(p) {
        if (p.directive) {
            var tpl = $compile( '<script type="text/ng-template" id="'+p.directive+'"><div class="av-plugin-'+p.directive+'"></div></script>' )($scope);
            if ($scope.shortst === p.name) {
                $scope.noplugin = false;
            }
        }
    });

    // removing autoreload stats
    ElectionsApi.autoreloadStats(null);

    function newElection() {
        var el = ElectionsApi.templateEl();
        $scope.current = el;
        ElectionsApi.setCurrent(el);
        ElectionsApi.newElection = true;

        return el;
    }

    if (id) {
        ElectionsApi.getElection(id)
            .then(function(el) {
                $scope.current = el;
                ElectionsApi.setCurrent(el);
            });
    }

    if ($scope.state === 'admin.new') {
        // New election
        newElection();
        $state.go("admin.basic");
    }

    var states =[ 'admin.dashboard', 'admin.basic', 'admin.questions', 'admin.censusConfig', 'admin.census', 'admin.auth', 'admin.tally', 'admin.successAction', 'admin.create'];
    if (states.indexOf($scope.state) >= 0) {
        $scope.sidebarlinks = [
            {name: 'basic', icon: 'university'},
            {name: 'questions', icon: 'question-circle'},
            {name: 'auth', icon: 'unlock'},
            {name: 'censusConfig', icon: 'newspaper-o'},
            {name: 'census', icon: 'users'},
            {name: 'successAction', icon: 'star-o'},
            //{name: 'tally', icon: 'pie-chart'},
        ];

        if (!id) {
            $scope.sidebarlinks.push({name: 'create', icon: 'rocket'});
            var current = ElectionsApi.currentElection;
            if (!current.title) {
                current = newElection();
            }
            $scope.current = current;
        }
    } else {
        $scope.sidebarlinks = [];
    }
  }
);
