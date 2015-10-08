(function() {
    var avThemes = this.avThemes = {};
    avThemes.current = 'default';

    avThemes.change = function(theme) {
        $("#theme").attr("href", "themes/"+theme+"/app.min.css");
    };
}).call(this);
