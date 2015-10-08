angular.module('avAdmin')
    .factory('AdminPlugins', function() {
        var plugins = {};
        plugins.plugins = {list: []};

        plugins.add = function(p) {
            // plugin format
            // {
            //  name: 'test',
            //  directive: 'test', (optional, only if this link has a directive)
            //  head: true | false,
            //  link: ui-sref link,
            //  menu: html() | {icon: icon, text: text}
            // }
            plugins.plugins.list.push(p);
        };

        plugins.reload = function(np) {
            var ps = plugins.plugins.list;
            plugins.plugins.list = [];
            ps.forEach(function(p) {
                if (np.name === p.name) {
                    plugins.plugins.list.push(np);
                } else {
                    plugins.plugins.list.push(p);
                }
            });
        };

        plugins.clear = function() {
            plugins.plugins.list = [];
        };

        plugins.remove = function(np) {
            var ps = plugins.plugins.list;
            plugins.plugins.list = [];
            ps.forEach(function(p) {
                if (np.name !== p.name) {
                    plugins.plugins.list.push(p);
                }
            });
        };

        return plugins;
    });
