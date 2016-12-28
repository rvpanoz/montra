define([
  'backbone', 'underscore'
], function (Backbone, _) {

  var User = Backbone.Model.extend({
    idAttribute: '_id',

    url: function () {
      if (this.isNew()) {
        return app.baseUrl + "/user";
      } else {
        return app.baseUrl + "/user/" + this.get('_id');
      }
    },

    defaults: {
      email: '',
      password: '',
      updated_at: new Date(),
      created_at: new Date()
    },

    parse: function (response) {
      return response.data;
    },

    validate: function (attrs) {
      var errors = [];

      function ValidateEmail(mail) {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
      }

      if (!attrs.email || _.isEmpty(attrs.email)) {
        errors.push({
          field: 'email',
          message: 'Field email is required'
        });
      } else {
        var isValidEmail = ValidateEmail(attrs.email);
        if(!isValidEmail) {
          errors.push({
            field: 'email',
            message: 'Email is invalid'
          });
        }
      }

      if (!attrs.password || _.isEmpty(attrs.password)) {
        errors.push({
          field: 'password',
          message: 'Field password is required'
        });
      }

      return _.isEmpty(errors) ? void 0 : errors;
    }
  });

  var Users = Backbone.Collection.extend({

    url: app.baseUrl + "/data/users",

    parse: function (response) {
      return response.data;
    }
  });

  return {
    model: User,
    collection: Users
  };

});
