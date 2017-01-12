define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  var DashboardView = Marionette.View.extend({
    template: templates.home,
    title: 'Dashboard',
    serializeData: function() {
      return {
        title: 'Dashboard'
      };
    }
  });

  return DashboardView;
});
