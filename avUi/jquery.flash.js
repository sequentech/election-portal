jQuery.fn.flash = function(duration) {
  var selector = this;

  if (!angular.isNumber(duration)) {
    duration = 300;
  }

  if (selector.attr("is-flashing") === "true") {
    return;
  }

  selector.attr("is-flashing", "true");

  selector
    .addClass("flashing")
    .delay(duration)
    .queue(function() {
      selector.removeClass("flashing").addClass("flashing-out").dequeue();
    })
    .delay(duration)
    .queue(function() {
      selector.removeClass("flashing flashing-out").dequeue();
      selector.attr("is-flashing", "false");
    });
};