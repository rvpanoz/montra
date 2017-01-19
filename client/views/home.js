define([
  'marionette',
  'templates',
  'chartjs'
], function(Marionette, templates) {

  var DashboardView = Marionette.View.extend({
    template: templates.home,
    title: 'Dashboard',
    ui: {
      'user-stats': '#user-stats'
    },
    initialize: function() {
      app.triggerMethod("sidebar:switch", "menu");
      this.data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
          label: "Monthly statistics",
          fill: false,
          data: [],
        }]
      };
      $.ajax({
        url: app.baseUrl + '/chart/sum',
        success: _.bind(function(response) {
          var data = response.data;
          this.data['data'] = data;
          var ctx = this.getUI('user-stats');
          this.chart = new Chart(ctx, {
            type: 'line',
            data: this.data,
            options: null
          });
        }, this)
      });
    },
    serializeData: function() {
      return {
        title: this.title
      }
    },

    onAttach: function() {
      console.log(this.options);
      var options = null;
    }
  });

  return DashboardView;
});
