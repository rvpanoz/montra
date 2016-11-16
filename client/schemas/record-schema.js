define([
  'backbone',
  'moment'
], function (Backbone, moment) {

  var Record = Backbone.Model.extend({
    idAttribute: '_id',
    url: function () {
      if (this.isNew()) {
        return app.baseUrl + "/data/record";
      } else {
        return app.baseUrl + "/data/records/" + this.get('_id');
      }
    },
    defaults: {
      title: '',
      situation: '',
      automatic_thoughts: '',
      rational_response: '',
      emotions: [],
      additional_notes: '',
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

  var Records = Backbone.Collection.extend({
    url: app.baseUrl + "/data/records",
    comparator: function (r1) {
      return -moment(r1.get('created_at')).unix();
    },
    parse: function(response) {
      return response.data;
    }
  });

  return {
    model: Record,
    collection: Records
  };

});
