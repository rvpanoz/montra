define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  var HeaderView =  Marionette.View.extend({
    template: templates.header,
    className: 'mui-appbar mui--appbar-line-height',
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

    onRender: function() {
      this.$el.attr('id', 'header');
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
