define([
  'marionette',
  'templates',
  'schemas/record-schema'
], function(Marionette, templates, RecordSchema) {

  var RecordsStatsView = Marionette.View.extend({
    template: templates.recordsStats,
    initialize: function(params) {
      var collection = params.collection;
      this.collection = new RecordSchema.collection();
      this.collection.reset(collection.allRecords);
    },

    serializeData: function() {
      var sumExpenses = 0,
        sumIncomes = 0;

      this.collection.each(function(model) {;
        var kind = model.get('kind').toString();
        var amount = parseFloat(model.get('amount'));
        if (kind == 1)
          sumExpenses += amount;
        if (kind == 2)
          sumIncomes += amount;
      });

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
