define([
  'marionette',
  'templates',
  'schemas/category-schema',
  'chartjs'
], function(Marionette, templates, CategorySchema, Chart) {

  var DashboardView = Marionette.View.extend({
    template: templates.home,
    title: 'Dashboard',
    ui: {
      canvas: '#pie-chart'
    },
    collectionEvents: {
      sync: 'onSync'
    },
    initialize: function() {
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },
    onSync: function() {
      var ctx = this.getUI('canvas');
      this.data = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FFCE56",
            "#36A2EB",
            "#FFCE56",
            "#CC33AA",
            "#BBBCCC",
            "#FFF000"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
      };

      $.ajax({
        url: app.baseUrl + "/charts/piechart",
        success: _.bind(function(response) {
          var dataItems = response.data;
          for (var z in dataItems) {
            var dataItem = dataItems[z];
            var id = dataItem._id;
            var model = this.collection.find(function(model) {
              return model.get('_id') == id;
            });

            this.data.labels.push('category-' + id);
            this.data.datasets[0].data.push(dataItem.total);
          }
          // For a pie chart
          var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: this.data,
            // options: options
          });
        }, this)
      });
    },

    onAttach: function() {

    }
  });

  return DashboardView;
});
