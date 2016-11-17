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
      this.showView(new LayoutView());
      if (Backbone.history) {
        Backbone.history.start();
      }
    },

    /**
    * dispatch function to handle internal app events
    **/
    onAppEvent: function(event, opts) {
      this.trigger(event, opts.data);
    }
  });

  var app = new Application();
  return window.app = app;
});
