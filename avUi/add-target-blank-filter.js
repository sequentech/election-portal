/**
 * Adds target blank to links.
 *
 * Usage example:
 *
 * <div ng-bind-html="foo.contentHtml | addTargetBlank"></div>
 */
angular.module('avUi')
  .filter('addTargetBlank', function(){
    return function(x) {
      //defensively wrap in a div to avoid 'invalid html' exception, then add
      //the target _blank to links
      var tree = angular.element('<div>'+x+'</div>');
      tree.find('a').attr('target', '_blank');

      //trick to have a string representation
      return angular.element('<div>').append(tree).html();
    };
  });