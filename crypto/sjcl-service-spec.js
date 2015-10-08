/*
 * SjclService unit tests
 * 
 * Tests if SjclService.codec.utf8String.toBits() and
 * SjclService.codec.codec.utf8String.fromBits() work properly
 */
/* jshint ignore:start */
describe("SjclService tests", function () {

  beforeEach(module("avCrypto"));

  beforeEach(inject(function (_SjclService_) {
    sjcl = _SjclService_;
  }));

  it("SjclService codec.utf8String.toBits/fromBits test", function () {
    var keyBits = sjcl.codec.utf8String.toBits("hola");
    expect(sjcl.codec.utf8String.fromBits(keyBits)).toBe("hola");
  });

});

/* jshint ignore:end */