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

    onBeforeStart: function() {
      this.router = new Router();
    },

    navigate: function(cls, opts) {
      app.router.navigate(JSON.stringify({
        cls: cls,
        params: opts
      }), {
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
