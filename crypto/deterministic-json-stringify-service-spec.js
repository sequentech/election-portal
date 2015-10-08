/*
 * DeterministicJsonStringifyService unit tests
 * 
 * Tests if stringify works properly with different JSON objects;
 * simple/complex ones, with arrays and lists, with accents, nested.
 * The stringify method returns a string representation of a JSON object.
 */
/* jshint ignore:start */
describe("DeterministicJsonStringifyService tests", function () {

  beforeEach(module("avCrypto"));

  beforeEach(inject(function (_DeterministicJsonStringifyService_) {
    stringify = _DeterministicJsonStringifyService_;
  }));

  it("DeterministicJsonStringifyService test (simple)", function () {
    var simpleJson = {
      "a": "1",
      "c": "3",
      "b": "2"
    };

    var simpleJson2 = {
      "c": "3",
      "a": "1",
      "b": "2"
    };
    var simpleJsonStr = '{"a":"1","b":"2","c":"3"}';
    expect(stringify(simpleJson)).toBe(simpleJsonStr);
    expect(stringify(simpleJson2)).toBe(simpleJsonStr);
  });

  it("DeterministicJsonStringifyService test (boolean)", function () {
    var booleanJson = {
      "llueve": false,
      "hace sol": true
    };
    var booleanJsonStr = '{"hace sol":true,"llueve":false}';
    expect(stringify(booleanJson)).toBe(booleanJsonStr);
  });

  it("DeterministicJsonStringifyService test (array)", function () {
    var arrayJson = {
      arrayX: [
        {"a": "1"},
        {"b": "2"}
      ],
      whatever: "yeah",
      "c": "3"
    };
    var arrayJsonStr = '{"arrayX":[{"a":"1"},{"b":"2"}],"c":"3","whatever":"yeah"}';
    expect(stringify(arrayJson)).toBe(arrayJsonStr);
  });

  it("DeterministicJsonStringifyService test (accents)", function () {
    var accentJson = {
      "con la a": "aventar",
      "lentejas": "ñam ñam, ¡qué ricas!",
      "¡¿otra más?!": "víbora hocicuda"
    };
    var accentJsonStr = '{"con la a":"aventar","lentejas":"ñam ñam, ¡qué ricas!",' +
        '"¡¿otra más?!":"víbora hocicuda"}';
    expect(stringify(accentJson)).toBe(accentJsonStr);
  });

  it("DeterministicJsonStringifyService test (size)", function () {
    var sizeJson = {
      "b": "456",
      "a": "123",
      "c": "789"
    };
    var sizeJsonStr = '{"a":"123","b":"456","c":"789"}';
    expect(stringify(sizeJson).length).toBe(sizeJsonStr.length);
  });

  it("DeterministicJsonStringifyService test (list)", function () {
    var listJson = {
      catList: [
        {
          "cat1": "foo",
          "cat2": "meow"
        },
        {
          "kitty1": "meeooww",
          "kitty2": "meow?"
        }
      ]
    };
    var listJsonStr = '{"catList":[{"cat1":"foo","cat2":"meow"},' +
            '{"kitty1":"meeooww","kitty2":"meow?"}]}';
    expect(stringify(listJson)).toBe(listJsonStr);
  });

  it("DeterministicJsonStringifyService test (complex)", function () {
    var complexJson = {
      "data":
              {"enrevesado":
                        {"Un tipo": [
                            {"id": "1", "nombre": "Pedrín"},
                            {"id": "2", "nombre": "Ozores"}
                          ]},
                "Otro tipo": [
                  {
                    "id": 2,
                    "xyz": ["1", "2", "3"],
                    "Un espacio": " ",
                    "Nada, en blanco": "",
                    "Es verdad": true,
                    "Es mentira": false,
                    "menos es nada": null
                  }
                ]
              },
      "algo":
              {"números":
                        [["80", "81"], ["90", "91"]]
              }
    };
    var complexJsonStr = '{"algo":{"números":[["80","81"],["90","91"]]},' +
            '"data":{"Otro tipo":[{"Es mentira":false,"Es verdad":true,' +
            '"Nada, en blanco":"","Un espacio":" ","id":2,' +
            '"menos es nada":null,"xyz":["1","2","3"]}],"enrevesado":' +
            '{"Un tipo":[{"id":"1","nombre":"Pedrín"},' +
            '{"id":"2","nombre":"Ozores"}]}}}';
    expect(stringify(complexJson)).toBe(complexJsonStr);
  });

});

/* jshint ignore:end */
