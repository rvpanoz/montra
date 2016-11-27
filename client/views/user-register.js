'use strict';

define([
  'marionette',
  'schemas/user-schema',
  'templates'
], function(Marionette, UserSchema, templates) {

  var RegisterView = Marionette.View.extend({
    template: templates.userRegister,
    className: 'user-register',
    bindings: {
      '#input-email': 'email',
      '#input-password': 'password'
    },
    events: {
      'click .register': 'onEventRegister',
      'click .signin': 'onEventSignin'
    },
    ui: {
      snackbar: '#snackbar'
    },
    initialize: function() {
      this.model = new UserSchema.model();
    },

    onRender: function() {
      this.stickit();
    },

    onEventRegister: function(e) {
      e.preventDefault();

      this.model.save(null, {
        success: _.bind(function(model) {
          app.navigate('user-signin');
        }, this),
        error: _.bind(function() {
          this.ui.snackbar[0].MaterialSnackbar.showSnackbar({
            message: 'Ooops! Email taken.'
          });
        }, this)
      });

      return false;
    },

    onEventSignin: function(e) {
      e.preventDefault();
      app.navigate('user-signin');
    }
  });

  return RegisterView;
});
