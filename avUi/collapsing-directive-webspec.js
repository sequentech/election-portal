/* jshint ignore:start */
describe("collapsing-directive tests", function () {

  beforeEach(function () {
    browser.get('/#/election/1/vote/ff66424d7d77607bbfe78209e407df6fff31abe214a1fe3b3a7dd82600ec0000/8dee0c135afeae29e208550e7258dab7b64fb008bc606fc326d41946ab8e773f:1:1411130040');
  });

  it("data-toggle-selector and unfixed-top-height are present", function () {
    var el = element(by.xpath('//div[@data-toggle-selector]'));
    expect(el.getAttribute('data-toggle-selector')).toBe('avb-start-screen #avb-toggle');
    expect(element(by.xpath('//div[@av-collapsing=".unfixed-top-height"]')).isPresent()).toBe(true);    
  });
  
  it("avb-help-screen is displayed on click", function () {
    var el = element(by.css('.glyphicon-question-sign'));
    expect(element(by.xpath('//avb-help-screen')).isPresent()).toBe(false);
    el.click();
    expect(element(by.xpath('//avb-help-screen')).isPresent()).toBe(true);    
  });

});

/* jshint ignore:end */