define([
  'backbone'
], function(Backbone) {

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
      name: '',
      updated_at: new Date(),
      created_at: new Date()
    },
    parse: function(response) {
      if(response.data) {
        if(_.isArray(response.data)) {
          return response.data[0];
        } else {
          return response.data;
        }
      }
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
