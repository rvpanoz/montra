define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  return Marionette.View.extend({
    template: templates.header,
    ui: {
      "signinButton": "#signin-button",
      "registerButton": "#register-button",
      "signoutButton": "#signout-button",
      "menu": "#menu-collapse"
    },
    events: {
      "click .navigate": "onNavigate",
      "click .signout": "onSignout"
    },
    initialize: function() {
      this.listenTo(app, 'user:signin', _.bind(function() {
        this.onUpdateUI(true);
      }, this));
      this.listenTo(app, 'user:signout', _.bind(function() {
        this.onUpdateUI();
        return app.navigate(app.signinUrl);
      }, this));
    },
    onAttach: function() {
      var token = localStorage.getItem('token');
      this.onUpdateUI(token);
    },
    onNavigate: function(e) {
      e.preventDefault();
      var cls = this.$(e.currentTarget).data('cls');
      this.ui.menu.collapse('hide');
      return app.navigate(cls);
    },
    onUpdateUI: function(signin) {
      if(signin) {
        this.ui.signinButton.hide();
        this.ui.registerButton.hide();
        this.ui.signoutButton.show();
      } else {
        this.ui.signinButton.show();
        this.ui.registerButton.show();
        this.ui.signoutButton.hide();
      }
    },
    onSignout: function(e) {
      e.preventDefault();
      this.onUpdateUI();
      app.onAppEvent('app:signout');
    }
  });

});
