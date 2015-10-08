/*
 * ElGamalService unit tests
 * Tests params/json on this service 
 */
/* jshint ignore:start */
describe("ElGamalService tests", function () {
  
  var jsonObj = {
    "p":"1",
    "q":"2",
    "g":"3"
  };

  beforeEach(module("avCrypto"));

  beforeEach(inject(function (_ElGamalService_) {
    ElGamal = _ElGamalService_;
  }));

  it("ElGamalService params/json test", function () {
    var egParams = new ElGamal.Params(
            BigInt.fromInt(jsonObj.p),
            BigInt.fromInt(jsonObj.q),
            BigInt.fromInt(jsonObj.g)
            );

    var newJsonObj = egParams.toJSONObject();
    expect(BigInt.fromInt(newJsonObj.p).toString()).toBe("1");   
    
  });

});

/* jshint ignore:end */