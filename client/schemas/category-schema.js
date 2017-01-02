define([
  'backbone', 'underscore'
], function(Backbone, _) {

  var Category =  Backbone.Model.extend({
    idAttribute: '_id',

    url: function () {
      if (this.isNew()) {
        return app.baseUrl + "/data/category";
      } else {
        return app.baseUrl + "/data/category/" + this.get('_id');
      }
    },

    defaults: {
      name: null,
      color: null,
      updated_at: new Date(),
      created_at: new Date()
    },

    parse: function(response) {
      var error;
      return response.data;
    },

    validate: function(attrs) {
      var errors = [];

      if(!attrs.name || _.isEmpty(attrs.name)) {
        errors.push({
          field: 'name',
          error: 'Field name is required'
        });
      }

      return _.isEmpty(errors) ? void 0 : errors;
    }
  });

  var Categories = Backbone.Collection.extend({

    url: app.baseUrl + "/data/categories",

    parse: function(response) {
      return response.data;
    }
  });

  return {
    model: Category,
    collection: Categories
  };

});
