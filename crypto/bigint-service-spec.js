/*
 * BigIntService unit tests
 * Passes a prime number to the service, converts it to a BigInt, 
 * converts it back and checks if it's the original number
 */
/* jshint ignore:start */
describe("BigIntService tests", function () {

  beforeEach(module("avCrypto"));

  beforeEach(inject(function (_BigIntService_) {
    BigInt = _BigIntService_;
  }));

  it("BigIntService prime test", function () {
    expect(new BigInt("2", 10).toString()).toBe("2");
  });

});

/* jshint ignore:end */