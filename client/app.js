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
    userForms: {
      "cls": "user-forms"
    },
    publicUrls: ['user-forms'],

    onBeforeStart: function() {
      this.router = new Router();
    },

    navigate: function(cls, opts) {
      var url = _.extend({
        cls: cls,
        opts: opts
      }), params;

      app.router.navigate(JSON.stringify(url), {
        trigger: true
      });

      return false;
    },

    onStart: function() {
      this.showView(new LayoutView());

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

        app.onAppEvent('userstate:change');
        app.navigate('home');
      }

      return false;
    },

    onSignout: function() {
      localStorage.clear();
      app.token = null;

      app.onAppEvent('userstate:change');
      app.navigate('user-forms');

      return false;
    },

    wait: function(active) {
      var spinner = $('.mdl-spinner');

      if(active == true) {
        spinner.addClass('is-active');
        $('.mdl-layout__obfuscator').addClass('is-visible');
      } else if(active == false){
        setTimeout(function() {
          spinner.removeClass('is-active');
          $('.mdl-layout__obfuscator').removeClass('is-visible');
        }, 500);
      }
    }
  });

  var app = new Application();

  return window.app = app;
});
