define([
  'marionette',
  'schemas/user-schema',
  'templates'
], function(Marionette, UserSchema, templates) {

    var UserFormsView = Marionette.View.extend({
      template: templates.login,
      title: 'User management',
      bindings: {
        '#input-email': 'email',
        '#input-password': 'password'
      },
      events: {
        'click input#btn-login': 'onSignin'
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

      onSignin: function(e) {
        e.preventDefault();
        var isValid = this.model.validate(this.model.attributes);
        if(_.isArray(isValid)) {
          this.model.trigger('invalid', this, isValid);
          return;
        }
        $.ajax({
          url: app.baseUrl + '/user/authenticate',
          method: 'POST',
          data: {
            email: this.model.get('email'),
            password: this.model.get('password')
          },
          success: function(response) {
            if(response.data.admin == true) {
              app.isAdmin = true;
            }
            var token = response.data.id_token;
            app.onAppEvent('app:signin', token);
          },
          error: _.bind(function() {

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
