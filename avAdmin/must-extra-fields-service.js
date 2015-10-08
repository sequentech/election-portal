angular.module('avAdmin')
  .factory('MustExtraFieldsService', function() {
    return function (el) {
      var ef = el.census.extra_fields;

      var name = 'email';
      var must = {};

      if (el.census.auth_method === 'email') {
        name = 'email';
        must = {
          "must": true,
          "name": "email",
          "type": "text",
          "required": true,
          "min": 2,
          "max": 200,
          "required_on_authentication": true
        };
      } else if (el.census.auth_method === 'sms') {
        name = 'tlf';
        must = {
          "must": true,
          "name": "tlf",
          "type": "text",
          "required": true,
          "min": 2,
          "max": 200,
          "required_on_authentication": true
        };
      } else if (el.census.auth_method === 'dnie') {
        name = 'dni';
        must = {
          "must": true,
          "name": "dni",
          "type": "text",
          "required": true,
          "min": 2,
          "max": 200,
          "required_on_authentication": true
        };
      }

      var found = false;
      ef.forEach(function(e) {
        if (e.name === name) {
          found = true;
          e.must = true;
        } else {
          e.must = false;
        }
      });

      if (!found) {
        ef.push(must);
      }
    };
  });
