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
        var view = new View(params);
        this.showChildView('mainRegion', view);
        app.triggerMethod("sidebar:switch", "menu");
        app.wait(false, true);
      });

      this.listenTo(app, 'userstate:change', _.bind(function(state) {
        this.checkState();
      }, this));
    },

    onRender: function() {
      this.checkState();
    },

    checkState: function() {
      var token = localStorage.getItem('token');
      if (token) {
        this.showChildView('sidebarRegion', new SidebarView());
        this.showChildView('navbarRegion', new NavbarView());
        $('.main').css({
          'padding-left': '200px',
          'margin-left': '-200px'
        });
      } else {
        this.getRegion('sidebarRegion').empty();
        this.getRegion('navbarRegion').empty();
        $('.main').css({
          'padding-left': 0,
          'margin-left:': 0
        });
      }
    }
  });

  return LayoutView;
});
