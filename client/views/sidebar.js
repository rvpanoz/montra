define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  var SidebarView =  Marionette.View.extend({
    template: templates.sidebar,
    className: 'sidebar',
    events: {
      'click a.navigation-link': 'onNavigate',
      'click a.signout': 'onSignout'
    },

    onNavigate: function(e) {
      e.preventDefault();
      var second_nav = $(this).find('.collapse').first();
      if (second_nav.length) {
        second_nav.collapse('toggle');
        $(this).toggleClass('opened');
      }
      var cls = this.$(e.currentTarget).data('cls');
      if(cls) {
        app.navigate(cls);
      }
      return false;
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
