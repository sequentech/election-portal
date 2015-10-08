/*
 * AnswerEncoderService unit tests
 * 
 */
/* jshint ignore:start */
describe("AnswerEncoderService tests", function () {

  beforeEach(module("avCrypto"));

  beforeEach(inject(function (_AnswerEncoderService_, _DeterministicJsonStringifyService_) {
    answerEncoder = _AnswerEncoderService_;
    stringify = _DeterministicJsonStringifyService_;
  }));

  it("AnswerEncoderService test", function () {
    
    var answer = [1, 5];
    var codec = answerEncoder("plurality-at-large", 7);
    expect(codec.sanityCheck()).toBe(true); // false
    
    var encoded = codec.encode(answer);
    var decoded = codec.decode(encoded);
    // false; [5, 1] == [1, 5]
    expect((stringify(decoded) == stringify(answer))).toBe(true);  
    
  });

});

/* jshint ignore:end */
