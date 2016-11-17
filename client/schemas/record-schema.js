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
      amount: 0,
      payment_method: 1,
      category_id: 0,
      additional_notes: '',
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
