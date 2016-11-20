'use strict';

define([
  'marionette',
  'schemas/user-schema',
  'templates'
], function(Marionette, UserSchema, templates) {

    var UserRegisterView = Marionette.View.extend({
      template: templates.userRegister,
      className: 'container',
      bindings: {
        '#input-email': 'email',
        '#input-password': 'password'
      },
      events: {
        'click #user-submit': 'onEventSave',
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
      onEventSave: function(e) {
        e.preventDefault();
        this.model.save(null, {
          success: _.bind(this.onEventSaveCallback, this)
        });
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

    return UserRegisterView;
});
