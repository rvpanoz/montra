define([
  'config',
  'backbone',
  'marionette',
  'router',
  'views/layout'
], function(config, Backbone, Marionette, Router, LayoutView) {
  'use strict';

  var Application = Marionette.Application.extend({
    region: '#app-content',
    baseUrl: config.protocol + config.host + ":" + config.port,
    homeUrl: {
      "cls": "home"
    },
    signinUrl: {
      "cls": "user-signin"
    },
    registerUrl: {
      "cls": "user-register"
    },
    publicUrls: ['user-signin', 'user-register'],

    onBeforeStart: function() {
      this.router = new Router();
    },

    navigate: function(cls, opts) {
      var url = {
        cls: cls,
        params: opts
      };
      app.router.navigate(JSON.stringify(url), {
        trigger: true
      });
    },

    onStart: function() {

      //show the layout view
      this.showView(new LayoutView());

      //start backbone history
      if (Backbone.history) {
        Backbone.history.start();
      }

      this.listenTo(this, 'app:signin', this.onSignin, this, arguments);
      this.listenTo(this, 'app:signout', this.onSignout, this, arguments);
    },

    // dispatch function to handle internal app events
    onAppEvent: function(event, opts) {
      this.trigger(event, opts);
    },

    onSignin: function(token) {
      if(token) {
        localStorage.setItem('token', token);
        app.token = token;
        app.navigate('home');
      }
      return false;
    },

    onSignout: function() {
      localStorage.clear();
      app.token = null;
      app.navigate('user-signin');
      return false;
    },

    showMessage: function() {
      $('.app-message').addClass('bounceInDown').show();
    },

    hideMessage: function() {
      $('.app-message').removeClass('bounceInDown').hide();
    },

    showModal: function() {
      $('.app-modal').modal('show');
    },

    hideModal: function() {
      $('.app-modal').modal('hide');
    }
  });

  var app = new Application();
  return window.app = app;
});
