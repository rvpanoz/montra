define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  var DashboardView = Marionette.View.extend({
    template: templates.home,
    title: 'Dashboard',
    onRender: function() {},
    serializeData: function() {
      return {
        title: this.title
      }
    }
  });

  return DashboardView;
});
