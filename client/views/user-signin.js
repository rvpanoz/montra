'use strict';

define([
  'marionette',
  'schemas/user-schema',
  'templates'
], function(Marionette, UserSchema, templates) {

    var UserSigninView = Marionette.View.extend({
      template: templates.userSignin,
      className: 'container',
      bindings: {
        '#input-email': 'email',
        '#input-password': 'password'
      },
      events: {
        'click #user-submit': 'onEventSignin',
        'click #user-back': 'onBack'
      },
      ui: {
        actions: 'div.form-actions',
        email: 'div.input-email',
        password: 'div.input-password'
      },
      initialize: function() {
        this.model = new UserSchema.model();
        this.listenTo(this.model, 'invalid', this.onValidationError, this);
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
            return false;
          }
        })
      },
      onEventSaveCallback: function(model) {
        app.navigate('home');
        return false;
      },
      onValidationError: function(model) {
        var errors = model.validationError;
        _.each(errors, function(err) {
          this.ui[err.field].addClass('has-error');
        }, this);
      },
      onBack: function(e) {
        e.preventDefault();
        app.navigate('home');
        return false;
      }
    });

    return UserSigninView;
});
