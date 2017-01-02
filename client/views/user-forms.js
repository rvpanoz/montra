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
        'click a.back': 'onSwitchForms',
        'click a.add': 'onSwitchForms',
        'click a.signin': 'onEventSignin',
        'click a.signup': 'onEventRegister'
      },
      ui: {
        snackbar: '#snackbar'
      },

      initialize: function() {
        this.model = new UserSchema.model();
        this.listenTo(this.model, 'invalid', _.bind(this._onInvalid, this));
      },

      _onInvalid: function(model, errors) {
        alert(errors[0].message);
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

      onAttach: function() {
        $('.mdl-layout__drawer').hide();
      },

      onRender: function() {
        this.stickit();
        $('#sidebar').hide();
        $('#navbar').hide();
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
