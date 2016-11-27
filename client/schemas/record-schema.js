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
      amount: null,
      payment_method: 1,
      entry_date: moment(new Date()).format('DD/MM/YYYY'),
      kind: 1,
      category_id: null,
      notes: '',
      updated_at: new Date(),
      created_at: new Date()
    },
    sync: function(method, model, options) {
      //override if necessary
      return Backbone.sync.call(this, method, model, options);
    },
    parse: function(response) {
      if (response.success == false) {
        let error = (response.error) ? response.error : false;
        this.trigger('invalid', this, error);
      }
      return response.data;
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
    comparator: function(r1) {
      return -moment(r1.get('entry_date')).unix();
    },
    parse: function(response) {
      return response.data;
    },
    get_expenses: function() {
      var filtered = this.filter(function(model) {
        return model.get('kind') == 1;
      });
      return filtered;
    },
    get_incomes: function() {
      var filtered = this.filter(function(model) {
        return model.get('kind') == 2;
      });
      return filtered;
    },
  });

  return {
    model: Record,
    collection: Records
  };

});
