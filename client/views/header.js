define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  return Marionette.View.extend({
    template: templates.header,
    ui: {
      "signinButton": ".signin",
      "signoutButton": ".signout",
      "menu": ".mdl-js-menu",
      "menuButton": "#hdrbtn",
      "titleButton": '.mdl-layout-title'
    },
    events: {
      "click .navigate": "onNavigate",
      "click .signout": "onSignout"
    },
    initialize: function() {
      this.listenTo(app, 'userstate:change', _.bind(function() {
        this.onUpdateUI();
      }, this));
    },

    onAttach: function() {
      this.onUpdateUI();
    },

    onNavigate: function(e) {
      e.preventDefault();
      var cls = this.$(e.currentTarget).data('cls');
      if(cls) {
        app.navigate(cls);
      }
    },

    onUpdateUI: function() {
      var token = localStorage.getItem('token');
      if(token) {
        this.ui.menu.show();
        this.ui.menuButton.show();
        this.ui.titleButton.show();
      } else {
        this.ui.menu.hide();
        this.ui.menuButton.hide();
        this.ui.titleButton.hide();
      }
    },

    onSignout: function(e) {
      e.preventDefault();
      app.onAppEvent('app:signout');
      this.onUpdateUI();
    }
  });

});
