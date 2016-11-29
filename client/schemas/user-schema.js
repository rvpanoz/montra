define([
  'backbone', 'underscore'
], function(Backbone, _) {

  var User =  Backbone.Model.extend({
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

    parse: function(response) {
      var error;
      if(response.success == false) {
        error = response.error;
        // this.trigger('invalid', this, error);
      }
      return response.data;
    },

    validate: function(attrs) {
      var errors = [];

      if(!attrs.email || _.isEmpty(attrs.email)) {
        errors.push({
          field: 'email',
          error: 'Field email is required'
        });
      }

      if(!attrs.password || _.isEmpty(attrs.password)) {
        errors.push({
          field: 'password',
          error: 'Field password is required'
        });
      }

      return _.isEmpty(errors) ? void 0 : errors;
    }
  });

  var Users = Backbone.Collection.extend({

    url: app.baseUrl + "/data/users",

    parse: function(response) {
      return response.data;
    }
  });

  return {
    model: User,
    collection: Users
  };

});
