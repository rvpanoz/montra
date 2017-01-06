define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  var SidebarView =  Marionette.View.extend({
    template: templates.sidebar,
    className: 'app-sidebar',
    events: {
      'click a.navigation-link': 'onNavigate',
      'click a.signout': 'onSignout'
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
    },

    onSignout: function(e) {
      if (e) {
        e.preventDefault();
      }
      app.trigger('app:signout');
      return false;
    }
  });

  return SidebarView;
});
