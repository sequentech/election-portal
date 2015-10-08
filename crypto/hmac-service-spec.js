/* jshint ignore:start */
describe("HmacService tests", function() {
  var HmacService;
  var key = "this is a secret";
  var message = "En un lugar de la Mancha";
  var hash = "6a4cdcebed4fad9f96bf3c6774919606c565570bac2ef808e764427eaf2377ea";

  beforeEach(module("avCrypto"));

  beforeEach(inject(function (_HmacService_) {
    HmacService = _HmacService_;
  }));

  it("should generate the expected hmac", inject(function() {
    expect(HmacService.hmac(key, message)).toBe(hash);
    expect(HmacService.checkHmac(key, message, hash)).toBe(true);
  }));

  it("should compare strings correctly", inject(function() {
    expect(HmacService.equal(hash, hash)).toBe(true);
    expect(HmacService.equal(hash, key)).toBe(false);
  }));
});
/* jshint ignore:end */