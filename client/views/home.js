define([
  'marionette',
  'templates',
  'moment',
  'chartjs'
], function(Marionette, templates, moment) {

  var DashboardView = Marionette.View.extend({
    template: templates.home,
    title: 'Dashboard',
    ui: {
      'user-stats': '#user-stats'
    },
    initialize: function() {
      app.triggerMethod("sidebar:switch", "menu");

      $.ajax({
        url: app.baseUrl + "/chart",
        data: {
          type: 'line',
          options: null
        },
        success: _.bind(function(response) {
          var data = response.data,
            _data = [];
          var months = _.range(1, 13);
          var monthsNames = moment.monthsShort();
          var monthsTotals = [];
          _.each(data, function(m, idx) {
            monthsTotals.push(parseFloat(m.totalAmount).toFixed(2))
          }, this);

          var chartdata = {
            labels: monthsNames,
            datasets: [{
              label: 'Total per month',
              backgroundColor: "rgba(179,181,198,0.2)",
              borderColor: "rgba(179,181,198,1)",
              pointBackgroundColor: "rgba(179,181,198,1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(179,181,198,1)",
              data: monthsTotals
            }]
          };

          var ctx = this.getUI('user-stats');
          this.chart = new Chart(ctx, {
            type: 'line',
            data: chartdata,
            options: {
              scale: {
                reverse: true,
                ticks: {
                  beginAtZero: true
                }
              }
            }
          });
        }, this)
      })
    },

    getDaysArrayByMonth: function() {
      var daysInMonth = moment().daysInMonth();
      var arrDays = [];

      while (daysInMonth) {
        var current = moment().date(daysInMonth).format('DD/MM');
        arrDays.push(current);
        daysInMonth--;
      }

      return arrDays.reverse();
    },

    serializeData: function() {
      return {
        title: this.title
      }
    }
  });

  return DashboardView;
});
