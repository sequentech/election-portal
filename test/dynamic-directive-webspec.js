/* jshint ignore:start */
describe("dynamic-directive tests", function () {

  beforeEach(function () {
    var html = '<textarea id="testTextArea" ng-model="testModel" ng-init="testModel = \'whatever\'"></textarea>';
    browser.get('/#/unit-test-e2e?html=' + encodeURIComponent(html));
  });

  it("dynamic directive should work with content with angular directives", function () {
    expect($('#testTextArea').isPresent()).toBe(true);
    expect($('#testTextArea').getAttribute("ng-model")).toBe("testModel");
    expect($('#testTextArea').getAttribute("value")).toBe("whatever");
  });

});
/* jshint ignore:end */