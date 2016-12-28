define([
  'marionette',
  'schemas/user-schema',
  'templates'
], function(Marionette, UserSchema, templates) {

    var UserFormsView = Marionette.View.extend({
      template: templates.userForms,
      className: 'user-forms',
      bindings: {
        '#signin-input-email': 'email',
        '#signin-input-password': 'password',
        '#signup-input-email': 'email',
        '#signup-input-password': 'password'
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
        this.listenTo(this.model, 'invalid', _.bind(this._onInvalid, this));
      },

      _onInvalid: function(model, errors) {
        if(errors) {
          this.ui.snackbar[0].MaterialSnackbar.showSnackbar({
            message: errors[0].message
          });
        }
        return false;
      },

      onAttach: function() {
        $('.mdl-layout__drawer').hide();
      },

      onRender: function() {
        this.stickit();
      },

      onEventSignin: function(e) {
        e.preventDefault();

        //validate model
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
            var token = response.data.id_token;
            app.onAppEvent('app:signin', token);
          },
          error: _.bind(function() {
            this.ui.snackbar[0].MaterialSnackbar.showSnackbar({
              message: 'Ooops! Something went wrong..'
            });
          }, this)
        });
        return false;
      },

      onEventRegister: function(e) {
        e.preventDefault();
        this.model.save(null, {
          success: _.bind(function(model) {
            app.navigate('user-signin');
          }, this),
          error: _.bind(function() {
            this.ui.snackbar[0].MaterialSnackbar.showSnackbar({
              message: 'Ooops! Email taken or is invalid.'
            });
          }, this)
        });

        return false;
      }
    });

    return UserFormsView;
});
