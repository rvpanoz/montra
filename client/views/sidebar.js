define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  var SidebarView =  Marionette.View.extend({
    template: templates.sidebar,
    className: 'app-sidebar',
    events: {
      'click a.navigation-link': 'onNavigate'
    },

    onRender: function() {
      this.$el.attr('id', 'sidebar');
    },
    onNavigate: function(e) {
      e.preventDefault();
      var cls = this.$(e.currentTarget).data('cls');
      if(cls) {
        app.navigate(cls);
      }
    }
  });

  return SidebarView;
});
