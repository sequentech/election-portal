/*
  usage:

    var encryptor = EncryptBallotService.init(pk);
    var ctext = encryptor.encryptAnswer(23);

  dependencies

  jsbn.js
  jsbn2.js
  bigint.js
  class.js
  elgamal.js
  random.js
  sha1.js
  sha2.js
  sjcl.js
*/

angular.module('avCrypto')
  .service('EncryptAnswerService', function(ElGamalService, BigIntService, RandomService, DeterministicJsonStringifyService) {
    return function (publicKeyJson) {
      // private members
      var publicKeyJsonCopy = publicKeyJson;
      var publicKey = ElGamalService.PublicKey.fromJSONObject(publicKeyJsonCopy);
      var proof2;

      // public interface
      return {

        // randomness argument is optional, used just for unit testing really
        encryptAnswer: function(plain_answer, randomness, randomness2) {
          var plaintext = new ElGamalService.Plaintext(
            BigIntService.fromJSONObject(plain_answer),
            publicKey,
            true);
          if (!randomness) {
            randomness = RandomService.getRandomInteger(publicKey.q);
          } else {
            randomness = BigIntService.fromInt(randomness);
          }

          if (!randomness2) {
            randomness2 = RandomService.getRandomInteger(publicKey.q);
          } else {
            randomness2 = BigIntService.fromInt(randomness2);
          }

          var ctext = ElGamalService.encrypt(publicKey, plaintext, randomness);
          // obtains proof of plaintext knowledge (schnorr protocol)
          var proof = plaintext.proveKnowledge(
            ctext.alpha,
            randomness,
            ElGamalService.fiatshamir_dlog_challenge_generator,
            randomness2);
          var ciphertext =  ctext.toJSONObject();
          var jsonProof = proof.toJSONObject();
          var encAnswer = {
            alpha: ciphertext.alpha,
            beta: ciphertext.beta,
            commitment: jsonProof.commitment,
            response: jsonProof.response,
            challenge: jsonProof.challenge,
            randomness: randomness.toJSONObject(),
            plaintext: plain_answer
          };

          return encAnswer;
        },

        getPublicKey: function() {
          return publicKeyJson;
        },

        // verifies the proof of plaintext knowledge (schnorr protocol)
        verifyPlaintextProof: function(encrypted) {
          var ctext = new ElGamalService.Ciphertext(
            BigIntService.fromInt(encrypted.alpha),
            BigIntService.fromInt(encrypted.beta),
            publicKey);
          var proof = new ElGamalService.DLogProof(
            new ElGamalService.PlaintextCommitment(
              BigIntService.fromInt(encrypted.alpha),
              BigIntService.fromInt(encrypted.commitment)
            ),
            BigIntService.fromInt(encrypted.challenge),
            BigIntService.fromInt(encrypted.response));

          return ctext.verifyPlaintextProof(
            proof,
            ElGamalService.fiatshamir_dlog_challenge_generator);
        }
      };
    };
  });
