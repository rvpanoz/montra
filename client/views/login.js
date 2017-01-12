define([
  'marionette',
  'schemas/user-schema',
  'templates'
], function(Marionette, UserSchema, templates) {

    var UserFormsView = Marionette.View.extend({
      template: templates.userForms,
      className: 'login',
      bindings: {
        '#signin-input-email': 'email',
        '#signin-input-password': 'password',
        '#signup-input-email': 'email',
        '#signup-input-password': 'password'
      },
      events: {
        'click button.toggle': 'onToggle',
        'click a.switch': 'onSwitchForms',
        'click a.signin': 'onEventSignin',
        'click a.signup': 'onEventRegister'
      },
      ui: {
        'user-profile': '.user-profile',
        'signin-input-email': '#signin-input-email',
        'signin-input-password': '#signin-input-password'
      },

      initialize: function() {
        this.model = new UserSchema.model();
        this.listenTo(this.model, 'invalid', _.bind(this._onInvalid, this));
      },

      onToggle: function(e) {
        e.preventDefault();
        this.getUI('user-profile').toggleClass('profile-open');
        return false;
      },

      _onInvalid: function(model, errors) {
        var message = errors[0].message;
        app.showMessage(message);
        return false;
      },

      onSwitchForms: function(e) {
        e.preventDefault();
        var signinForm = this.$('.user-signin');
        var signupForm = this.$('.user-signup');
        if(signinForm.is(":visible")) {
          signinForm.hide();
          signupForm.show();
        } else {
          signinForm.show();
          signupForm.hide();
        }
        return false;
      },

      onRender: function() {
        this.stickit();
      },

      onEventSignin: function(e) {
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
            var token = response.data.id_token;
            app.onAppEvent('app:signin', token);
          },
          error: _.bind(function() {
            console.log(arguments);
          }, this)
        });
        return false;
      },

      onEventRegister: function(e) {
        e.preventDefault();
        this.model.save(null, {
          success: _.bind(function(model) {
            this.$('.user-signin').show();
            this.$('.user-signup').hide();
          }, this),
          error: _.bind(function() {
            console.log('Ooops! Email taken or is invalid.');
          }, this)
        });

        return false;
      }
    });

    return UserFormsView;
});
