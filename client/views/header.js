define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  var HeaderView =  Marionette.View.extend({
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

    onNavigate: function(e) {
      e.preventDefault();
      var cls = this.$(e.currentTarget).data('cls');
      if(cls) {
        app.navigate(cls);
      }
    },

    onSignout: function(e) {
      e.preventDefault();
      localStorage.clear();
      app.onAppEvent('userstate:change');
      app.navigate('user-forms');
    }

  });

  return HeaderView;
});
