define([
  'backbone'
], function(Backbone) {

  var Category =  Backbone.Model.extend({
    idAttribute: '_id'
  });

  var Categories = Backbone.Collection.extend({
    url: app.baseUrl + "/data/categories",
    model: Category,
    parse: function(response) {
      return response.data;
    }
  });

  return {
    model: Category,
    collection: Categories
  };

});
