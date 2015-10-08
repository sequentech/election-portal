/* jshint ignore:start */
describe("affix-top-directive tests", function () {

  beforeEach(function () {
//    var html = '<nav av-affix-top style="height: 40px;"></nav>';
    var html = '<style>' + 
            '.navbar-fixed-top {min-height: 40px;}' +
            '.navbar-unfixed-top {margin: 0;}' +
            '</style>' + 
            '<nav class="navbar-fixed-top" av-affix-top=".navbar-unfixed-top"></nav>';
    browser.get('/#/unit-test-e2e?html=' + encodeURIComponent(html));
  });

  it("margin-top is present", function () {
    browser.manage().window().setSize(320, 480);
    expect(element(by.xpath('//nav[contains(@navbar-unfixed-top, margin-top)]')).isPresent()).toBe(true);
  });

});

/* jshint ignore:end */