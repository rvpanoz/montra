define([
  'backbone',
  'moment'
], function(Backbone, moment) {

  var Record = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
      if (this.isNew()) {
        return app.baseUrl + "/data/record";
      } else {
        return app.baseUrl + "/data/records/" + this.get('_id');
      }
    },
    defaults: {
      _selected: false,
      amount: null,
      payment_method: 1,
      kind: 1,
      entry_date: new Date(),
      category_id: null,
      updated_at: new Date(),
      created_at: new Date()
    },
    sync: function(method, model, options) {
      //override if necessary
      return Backbone.sync.call(this, method, model, options);
    },
    parse: function(response) {
      var data;
      if (response.success == false) {
        var error = (response.error) ? response.error : false;
        this.trigger('invalid', this, error);
      } else {
        if(response.data) {
          data = response.data;
          data.entry_date = moment(data.entry_date).format('DD/MM/YYYY');
          data.amount = data.amount.toFixed(2);
        }
      }
      return data;
    },
    validate: function(attrs) {
      var errors = [];

      if (!attrs.amount) {
        errors.push({
          field: 'amount',
          error: 'Field amount is required'
        });
      }

      if (!attrs.category_id) {
        errors.push({
          field: 'category_id',
          error: 'Field category_id is required'
        });
      }

      if (!attrs.entry_date) {
        errors.push({
          field: 'entry_date',
          error: 'Field entry_date is required'
        });
      }

      return _.isEmpty(errors) ? void 0 : errors;
    }
  });

  var Records = Backbone.Collection.extend({
    url: app.baseUrl + "/data/records",
    sortField: null,
    sortDir: 1,
    pages: 1,
    page: 1,
    parse: function(response) {
      this.allRecords = response.allData;
      this.total = response.total;
      this.pages = response.pages;
      this.page = response.page;
      _.each(response.data, function(record) {
        record.amount = record.amount.toFixed(2);
      });
      return response.data;
    },
    comparator: function(m1) {
      var field = this.sortField;
      var dir = this.sortDir;
      return (dir == -1) ? -m1.get(field) : m1.get(field);
    }
  });

  return {
    model: Record,
    collection: Records
  };

});
