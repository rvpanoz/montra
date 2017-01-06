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
          backgroundColor: []
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

            this.data.labels.push(model.get('name'));
            this.data.datasets[0].data.push(dataItem.total);
            if(_.isNull(model.get('color')))
              model.set('color', '#ccc');
            this.data.datasets[0].backgroundColor.push(model.get('color'));
          }

          var pieChart = new Chart(ctx, {
            type: 'pie',
            data: this.data
          });
        }, this)
      });
    }

  });

  return DashboardView;
});
