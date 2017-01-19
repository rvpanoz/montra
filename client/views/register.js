define([
  'underscore',
  'marionette',
  'schemas/user-schema',
  'templates'
], function(_, Marionette, UserSchema, templates) {

    var UserFormsView = Marionette.View.extend({
      template: templates.register,
      title: 'User management',
      bindings: {
        '#input-email': 'email',
        '#input-password': 'password'
      },
      events: {
        'click input#btn-register': 'onRegister',
        'click input#btn-cancel': 'onCancel'
      },
      ui: {
        'input-email': '#input-email',
        'input-password': '#input-password'
      },

      initialize: function() {
        this.model = new UserSchema.model();
        this.listenTo(this.model, 'invalid', _.bind(this._onInvalid, this));
      },

      _onInvalid: function(model, errors) {
        var message = errors[0].message;
        app.showMessage(message);
        return false;
      },

      onRender: function() {
        this.stickit();
      },

      onCancel: function(e) {
        e.preventDefault();
        return app.navigate('login');
      },

      onRegister: function(e) {
        e.preventDefault();
        this.model.save(null, {
          success: _.bind(function(model) {
            app.navigate('login', {
              registered: true
            });
          }, this),
          error: _.bind(function() {
            console.log('Ooops! Email taken or is invalid.');
          }, this)
        });

        return false;
      },

      serializeData: function() {
        return {
          title: this.title
        }
      }
    });

    return UserFormsView;
});
