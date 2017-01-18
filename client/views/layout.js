define([
  'marionette',
  'templates',
  '../views/sidebar',
  '../views/header'
], function(Marionette, templates, SidebarView, NavbarView) {
  "use strict";

  var LayoutView = Marionette.View.extend({
    template: templates.layout,
    className: 'app-view',
    regions: {
      navbarRegion: '#navbar',
      sidebarRegion: '#sidebar-content',
      mainRegion: '#main-content',
      loginRegion: '.login-form'
    },
    initialize: function() {
      var mainRegion = this.getRegion('mainRegion');
      this.listenTo(app, 'app:view_show', function(View, params) {
        this.showChildView('mainRegion', new View(params));
        app.wait(false, true);
      });

      this.listenTo(app, 'userstate:change', _.bind(function(state) {
        this.checkState();
      }, this));
    },

    onBeforeRender: function() {

    },

    onRender: function() {
      this.checkState();
    },

    checkState: function() {
      var token = localStorage.getItem('token');
      if (token) {
        this.showChildView('sidebarRegion', new SidebarView());
        this.showChildView('navbarRegion', new NavbarView());
      } else {
        this.getRegion('sidebarRegion').empty();
        this.getRegion('navbarRegion').empty();
      }
    }
  });

  return LayoutView;
});
