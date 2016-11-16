define([
  'backbone'
], function(Backbone) {

  var Emotion =  Backbone.Model.extend({
    idAttribute: '_id'
  });

  var Emotions = Backbone.Collection.extend({
    url: app.baseUrl + "/data/emotion",
    model: Emotion,
    parse: function(response) {
      return response.data;
    }
  });

  return {
    model: Emotion,
    collection: Emotions
  };

});
