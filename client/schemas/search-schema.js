define([
  'backbone',
  'moment'
], function(Backbone, moment) {

  var SearchModel = Backbone.Model.extend({
    url: app.baseUrl + "/search/records",
    parse: function(response) {
      console.log(response);
      return response.data;
    }
  });

  return SearchModel;
})
