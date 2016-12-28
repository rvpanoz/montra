define([
  'marionette',
  'templates'
],function(Marionette, templates) {

  var BalanceView = Marionette.View.extend({
    template: templates.balanceView,
    serializeData: function() {
      return _.extend({}, {
        stats: {
          expenses: 100,
          incomes: 200,
          balance: (100 - 200)
        }
      });
    }
  });

  return BalanceView;
});
