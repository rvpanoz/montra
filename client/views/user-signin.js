'use strict';

define([
  'marionette',
  'schemas/user-schema',
  'templates'
], function(Marionette, UserSchema, templates) {

    var UserSigninView = Marionette.View.extend({
      template: templates.userSignin,
      className: 'user-signin',
      bindings: {
        '#input-email': 'email',
        '#input-password': 'password'
      },
      events: {
        'click button.signin': 'onEventSignin',
        'click button.register': 'onEventRegister'
      },
      ui: {
        snackbar: '#snackbar'
      },
      initialize: function() {
        this.model = new UserSchema.model();
      },
      onAttach: function() {
        $('.mdl-layout__drawer').hide();
      },
      onRender: function() {
        this.stickit();
      },
      onEventSignin: function(e) {
        e.preventDefault();
        $.ajax({
          url: app.baseUrl + '/user/authenticate',
          method: 'POST',
          data: {
            email: this.model.get('email'),
            password: this.model.get('password')
          },
          success: function(response) {
            var token = response.data.id_token;
            app.onAppEvent('app:signin', token);
          },
          error: _.bind(function() {
            this.ui.snackbar[0].MaterialSnackbar.showSnackbar({
              message: 'Ooops! Wrong credentials.'
            });
          }, this)
        });
        return false;
      },
      onEventRegister: function(e) {
        e.preventDefault();
        app.navigate('user-register');
      }
    });

    return UserSigninView;
});
