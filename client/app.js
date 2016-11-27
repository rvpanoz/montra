define([
  'config',
  'backbone',
  'marionette',
  'router',
  'views/layout'
], function(config, Backbone, Marionette, Router, LayoutView) {
  'use strict';

  var Application = Marionette.Application.extend({
    content: null,
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
        $('.mdl-layout__header').show();
        app.navigate('home');
        app.onAppEvent('userstate:change');
      }
    },

    onSignout: function() {
      localStorage.clear();
      app.token = null;
      $('.mdl-layout__header').hide();
      app.navigate('user-signin');
      app.onAppEvent('userstate:change');
    }
  });

  var app = new Application();
  return window.app = app;
});
