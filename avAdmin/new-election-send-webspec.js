/* jshint ignore:start */
describe("NewElectionSend tests", function() {

  beforeEach(function () {
    browser.get('/#/admin/new');
  });

  it("should open form for add new question", function() {
    var el = element(by.id('newq'));
    expect(element(by.id('nq')).isDisplayed()).toBe(false);
    el.click();
    expect(element(by.id('nq')).isDisplayed()).toBe(true);
  });

  it("should throw error: Enter a valid election title", function() {
    expect(element(by.repeater('e in election.errors')).isPresent()).toBe(false);
    element(by.css('.glyphicon-save')).click();
    expect(element(by.repeater('e in election.errors')).isPresent()).toBe(true);
    var results = element.all(by.repeater('e in election.errors'));
    expect(results.count()).toEqual(3);
    expect(results.first().getText()).toEqual('Enter a valid election title');
    expect(results.get(0).getText()).toEqual('Enter a valid election title');
  });

  it("should throw error: Enter a valid election description", function() {
    expect(element(by.repeater('e in election.errors')).isPresent()).toBe(false);
    var name = element(by.id('name'));
    name.sendKeys("test");
    element(by.css('.glyphicon-save')).click();
    expect(element(by.repeater('e in election.errors')).isPresent()).toBe(true);
    var results = element.all(by.repeater('e in election.errors'));
    expect(results.first().getText()).toEqual('Enter a valid election description');
  });

  it("should throw error: Add at least one question", function() {
    expect(element(by.repeater('e in election.errors')).isPresent()).toBe(false);
    var name = element(by.id('name'));
    name.sendKeys("test");
    var desc = element(by.id('desc'));
    desc.sendKeys("test description");
    element(by.css('.glyphicon-save')).click();
    expect(element(by.repeater('e in election.errors')).isPresent()).toBe(true);
    var results = element.all(by.repeater('e in election.errors'));
    expect(results.first().getText()).toEqual('Add at least one question');
  });

  it("should throw error: Enter a valid question title", function() {
    expect(element(by.repeater('e in newquestion.errors')).isPresent()).toBe(false);
    element(by.id('newq')).click();
    element(by.id('saveq')).click();
    expect(element(by.repeater('e in newquestion.errors')).isPresent()).toBe(true);
    var results = element.all(by.repeater('e in newquestion.errors'));
    expect(results.first().getText()).toEqual('Enter a valid question title');
  });

  it("should throw error: Add at least one option", function() {
    expect(element(by.repeater('e in newquestion.errors')).isPresent()).toBe(false);
    element(by.id('newq')).click();
    var qtext = element(by.id('qtext'));
    qtext.sendKeys("test question");
    element(by.id('saveq')).click();
    expect(element(by.repeater('e in newquestion.errors')).isPresent()).toBe(true);
    var results = element.all(by.repeater('e in newquestion.errors'));
    expect(results.first().getText()).toEqual('Add at least one option');
  });

  it("should add one option", function() {
    element(by.id('newq')).click();
    var qtext = element(by.id('qtext'));
    qtext.sendKeys("test question");
    element(by.id('newopt')).click();
    element(by.id('saveq')).click();
    expect(element(by.repeater('e in newquestion.errors')).isPresent()).toBe(false);
    expect(element(by.repeater('q in questions')).isPresent()).toBe(true);
    var results = element.all(by.repeater('q in questions'));
    expect(results.count()).toEqual(1);
  });

  it("should create a new election", function() {
    var name = element(by.id('name'));
    name.sendKeys("test");
    var desc = element(by.id('desc'));
    desc.sendKeys("test description");

    element(by.id('newq')).click();
    var qtext = element(by.id('qtext'));
    qtext.sendKeys("test question");
    element(by.id('newopt')).click();
    element(by.id('saveq')).click();

    element(by.css('.glyphicon-save')).click();
    expect(element(by.repeater('e in election.errors')).isPresent()).toBe(false);
  });

});
/* jshint ignore:end */

