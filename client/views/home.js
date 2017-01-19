define([
  'marionette',
  'templates',
  'chartjs'
], function (Marionette, templates) {

  var DashboardView = Marionette.View.extend({
    template: templates.home,
    title: 'Dashboard',
    ui: {
      'user-stats': '#user-stats'
    },
    initialize: function () {
      this.data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Monthly statistics",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
        }]
      };
    },
    serializeData: function () {
      return {
        title: this.title
      }
    },

    onAttach: function () {
      var options = null;
      var ctx = this.getUI('user-stats');
      this.chart = new Chart(ctx, {
          type: 'line',
          data: this.data,
          options: options
      });
    }
  });

  return DashboardView;
});
