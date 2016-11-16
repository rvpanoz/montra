define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  return Marionette.View.extend({
    template: templates.header,
    ui: {
      "signinButton": "#signin-button",
      "signoutButton": "#signout-button"
    },
    events: {
      "click .navigate": "onNavigate",
    },
    onNavigate: function(e) {
      e.preventDefault();
      var cls = this.$(e.currentTarget).data('cls');
      return app.navigate(cls);
    },
    onAttach: function() {
      let access_token = sessionStorage.getItem('access_token');

      app.triggerMethod('update:status', {
        status: (access_token === "false" || _.isNull(access_token)) ? false : true
      });
    }

  });

});
