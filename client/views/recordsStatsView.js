define([
  'marionette',
  'templates',
  'schemas/record-schema'
], function(Marionette, templates, RecordSchema) {

  var RecordsStatsView = Marionette.View.extend({
    template: templates.recordsStats,
    collectionEvents: {
      'reset': 'render'
    },

    initialize: function(collection) {
      this.collection = new RecordSchema.collection();
    },

    onRender: function() {
      // debugger;
    },

    serializeData: function() {
      var sumExpenses = 0,
        sumIncomes = 0;
        // debugger;
      _.each(this.collection.models, function(model) {
        var kind = model.get('kind').toString();
        var amount = parseFloat(model.get('amount'));
        if (kind == 1)
          sumExpenses += amount;
        if (kind == 2)
          sumIncomes += amount;
      }, this);

      var balance = sumIncomes - sumExpenses;

      return _.extend({}, {
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
