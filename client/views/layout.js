define([
  'marionette',
  'templates',
  '../views/sidebar'
], function(Marionette, templates, SidebarView) {
  "use strict";

  var LayoutView =  Marionette.View.extend({
    template: templates.layout,
    className: 'layout-view',
    regions: {
      sidebarRegion: '#sidebar',
      mainRegion: '#main-content'
    },
    events: {
      'click .navigation-link': 'onNavigate'
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

      }, this));

    },

    onNavigate: function(e) {
      if(e) {
        e.preventDefault();
      }

      var target = this.$(e.currentTarget);
      var cls = target.data('cls');

      if (cls) {
        target.addClass('active');
        app.navigate(cls);
      }

      return false;
    },

    onAttach: function() {
      var token = localStorage.getItem('token');
      // this.getRegion('sidebarRegion').show(this.sidebarView);
    },

    onRender: function() {
      this.showChildView('sidebarRegion', new SidebarView());
      // this.sidebarView = new SidebarView();
    }

  });

  return LayoutView;
});
