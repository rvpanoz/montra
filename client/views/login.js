define([
  'underscore',
  'marionette',
  'schemas/user-schema',
  'templates'
], function (_, Marionette, UserSchema, templates) {

  var UserFormsView = Marionette.View.extend({
    template: templates.login,
    title: 'User management',
    bindings: {
      '#input-email': 'email',
      '#input-password': 'password'
    },
    events: {
      'click input#btn-login': 'onSignin',
      'click input#btn-register': 'onRegister'
    },
    ui: {
      'input-email': '#input-email',
      'input-password': '#input-password'
    },

    initialize: function (params) {
      this.params = params;
      this.model = new UserSchema.model();
      this.listenTo(this.model, 'invalid', _.bind(this._onInvalid, this));
    },

    _onInvalid: function (model, errors) {
      _.each(errors, function (err) {
        var input = this.$('.form-group-' + err.field);
        if (input.length) {
          input.addClass('has-error');
        }
      }, this);
      return false;
    },

    onRegister: function(e) {
      e.preventDefault();
      return app.navigate('register');
    },

    onRender: function () {
      this.stickit();
      if(_.has(this.params, 'registered')) {
        this.$('#registered').modal('toggle');
      }
    },

    onSignin: function (e) {
      e.preventDefault();
      var isValid = this.model.validate(this.model.attributes);
      if (_.isArray(isValid)) {
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
        success: function (response) {
          if (response.data.admin == true) {
            app.isAdmin = true;
          }
          var token = response.data.id_token;
          app.onAppEvent('app:signin', token);
        },
        error: _.bind(function () {

        }, this)
      });
      return false;
    },

    serializeData: function () {
      return {
        title: this.title
      }
    }
  });

  return UserFormsView;
});
