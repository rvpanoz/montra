define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  var DashboardView = Marionette.View.extend({
    template: templates.browseRecords,
    title: 'Records',
    serializeData: function() {
      return {
        title: this.title
      }
    }
  });

  return DashboardView;
});
