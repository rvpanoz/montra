define([
  'marionette',
  'templates',
  'chartjs'
], function(Marionette, templates) {

  var TotalsView = Marionette.View.extend({
    template: templates.totalsView,
    incomes: 0,
    expenses: 0,
    balance: 0,
    className: 'panel panel-success',
    ui: {
      canvas: '#totals'
    },
    initialize: function(opts) {
      this.collection = opts.collection;
      this.expenses = this.collection.getAllExpenses();
      this.incomes = this.collection.getAllIncomes();
    },
    onRender: function() {
      if(!this.collection.length) {
        return true;
      }
      var ctx = this.getUI('canvas');
      var data = this.generateData();
      this.barChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: data,
        options: this.options
      });
    },
    serializeData: function() {
      var expenses = 0, incomes = 0;
      _.each(this.expenses, function(record) {
        var amount = record.amount;
        var type = record.kind;
        if(type == 2) {
          incomes = Number(parseFloat(incomes + amount).toFixed(2));
        } else if(type == 1) {
          expenses = Number(parseFloat(expenses + amount).toFixed(2));
        }
      }, this);
      
      var balance = parseFloat(incomes - expenses).toFixed(2);
      return {
        recordsNo: this.collection.total,
        incomes: incomes,
        expenses: expenses,
        balance: balance
      }
    },
    generateData: function() {
      var allRecords = this.collection.allRecords;
      var data = {
        labels: ["Incomes", "Expenses", "Balance"],
        datasets: [{
          label: "Statistics",
          backgroundColor: [
            "#4BC0C0",
            "#E7E9ED",
            "#36A2EB"
        ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1,
          data: [],
        }]
      };

      // this.collection.reset(allRecords);
      _.each(allRecords, _.bind(function(model) {
        var k = model.kind;
        var amount = Number(model.amount);
        switch (k) {
          case 2:
            this.incomes+=amount;
            break;
          default:
            this.expenses+=amount;
        }
      }, this));

      this.expenses = parseFloat(this.expenses).toFixed(2);
      this.incomes = parseFloat(this.incomes).toFixed(2);

      data.datasets[0].data.push(this.incomes);
      data.datasets[0].data.push(this.expenses);
      this.balance = parseFloat(this.incomes - this.expenses).toFixed(2);
      data.datasets[0].data.push(this.balance);

      return data;
    }
  });

  return TotalsView;
});
