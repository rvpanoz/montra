define([
  'marionette',
  'templates',
  'schemas/record-schema'
], function(Marionette, templates, RecordSchema) {

  var RecordsStatsView = Marionette.View.extend({
    template: templates.recordsStats,
    collectionEvents: {
      'change': 'render',
      'remove': 'render'
    },

    initialize: function(params) {
      var allRecords = [];

      this.collection = new RecordSchema.collection();

      if(params && params.collection) {
        debugger;
      }
    },

    serializeData: function() {
      var sumExpenses = 0,
        sumIncomes = 0;

      _.each(this.collection.models, function(model) {
        var kind = model.get('kind').toString();
        var amount = parseFloat(model.get('amount'));
        if (kind == 1)
          sumExpenses += amount;
        if (kind == 2)
          sumIncomes += amount;
      }, this);

      var balance = sumIncomes - sumExpenses;

      return _.extend(this.collection.toJSON(), {
        stats: {
          total: this.collection.length,
          expenses: sumExpenses.toFixed(2),
          incomes: sumIncomes.toFixed(2),
          balance: balance.toFixed(2)
        }
      });
    }
  });

  return RecordsStatsView;
});
