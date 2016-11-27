define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  var SidebarView = Marionette.View.extend({
    template: templates.sidebar
  });

  return SidebarView;
});
