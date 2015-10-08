/*
 * Implements the Keyed-Hash Message Authentication Code (HMAC) using SJCL
 * library, using SHA256, encoding the key to bits and returning an string
 * with result codified in hexadecimal. An HMAC is a cryptographic hash that
 * uses a key to sign a message. The receiver verifies the hash by recomputing
 * it using the same key.
 *
 * Receivers should be careful to use Equal or CheckHmac functions to compare
 * MACs in order to avoid timing side-channels.
 */

angular.module('avCrypto')
  .service('HmacService', function(SjclService) {

    function hmacFunc(key, message) {
      var keyBits = SjclService.codec.utf8String.toBits(key);
      var out = (new SjclService.misc.hmac(keyBits, SjclService.hash.sha256)).mac(message);
      return SjclService.codec.hex.fromBits(out);
    }

    function equalFunc(a, b) {
        var aLength = a.length,
            bLength = b.length,
            match = aLength === bLength ? 1 : 0,
            i = aLength;

        while ( i-- ) {
            var aChar = a.charCodeAt( i % aLength ),
                bChar = b.charCodeAt( i % bLength ),
                equ = aChar === bChar,
                asInt = equ ? 1 : 0;
            match = match & equ;
        }

        return match === 1;
    }

    /**
     * This function checks a keyed hmac Url. Here's an example:
     * > checkKhmac("khmac:///sha-256;6a4cdcebed4fad9f96bf3c6774919606c565570bac2ef808e764427eaf2377ea/userid:vote:election:1110:134234111");
     * < returns {
     *     "digest": "6a4cdcebed4fad9f96bf3c6774919606c565570bac2ef808e764427eaf2377ea",
     *     "digestMethod": "sha-256",
     *     "timestamp": 134234111,
     *     "message": "userid:vote:election:1110:134234111"
     *   }
     *
     * returns false if the url is invalid.
     */
    function checkKhmac(url) {
      var knownStart = "khmac:///sha-256;";
      if (url.substr(0, knownStart.length) !== knownStart) {
        return false;
      }

      var splitSlash = url.substr(knownStart.length, url.length).split("/");
      if (splitSlash.length !== 2) {
        return false;
      }
      var hash = splitSlash[0];
      var message = splitSlash[1];

      var hashFormat = /^[0-9a-f]{64}$/;

      if (!hashFormat.test(hash) || $.type(message) !== "string") {
        return false;
      }

      var splitMessage = message.split(":");
      if (splitMessage.length === 0) {
        return false;
      }

      var timestamp = parseInt(splitMessage[splitMessage.length - 1]);
      if (isNaN(timestamp) || timestamp < 0) {
        return false;
      }

      return {
        digest: hash,
        digestMethod: "sha-256",
        timestamp: timestamp,
        message: message
      };
    }

    return {
      "checkHmac": function(key, message, messageMAC) {
        return equalFunc(hmacFunc(key, message), messageMAC);
      },
      "hmac": hmacFunc,
      "equal": equalFunc,
      "checkKhmac": checkKhmac
    };
  });
