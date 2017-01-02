define([
  'marionette',
  'templates',
  '../views/sidebar',
  '../views/header'
], function(Marionette, templates, SidebarView, NavbarView) {
  "use strict";

  var LayoutView =  Marionette.View.extend({
    template: templates.layout,
    className: 'layout-view',
    regions: {
      navbarRegion: '#navbar',
      sidebarRegion: '#sidebar',
      mainRegion: '#main-content'
    },
    events: {
      'click .signout': 'onSignout'
    },
    initialize: function() {
      var mainRegion = this.getRegion('mainRegion');

      this.listenTo(app, 'app:view_show', function(View, params) {

        //show the main view
        this.showChildView('mainRegion', new View(params));

        //remove obs
        app.wait(false, true);
      });

      this.listenTo(app, 'userstate:change', _.bind(function() {
        $('#sidebar').toggle();
        $('#navbar').toggle();
      }, this));

    },

    onSignout: function(e) {
      if(e) {
        e.preventDefault();
      }

      app.trigger('app:signout');
      return false;
    },

    onAttach: function() {
      var token = localStorage.getItem('token');
    },

    onRender: function() {
      this.showChildView('sidebarRegion', new SidebarView());
      this.showChildView('navbarRegion', new NavbarView());
    }

  });

  return LayoutView;
});
