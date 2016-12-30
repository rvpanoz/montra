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
    publicUrls: ['user-forms'],

    onBeforeStart: function() {
      this.router = new Router();
    },

    navigate: function(cls, params) {
      var url = _.extend({
        cls: cls,
        params: params
      });

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
        app.navigate('records');
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

    wait: function(active, t) {
      var spinner = $('.mdl-spinner');
      var tm = (t) ? 0 : 500;

      if(active == true) {
        spinner.addClass('is-active');
        $('.mdl-layout__obfuscator').addClass('is-visible');
      } else if(active == false){
        setTimeout(function() {
          spinner.removeClass('is-active');
          $('.mdl-layout__obfuscator').removeClass('is-visible');
        }, tm);
      }
    },

    stringToDate(_date, _format, _delimiter) {
      var formatLowerCase = _format.toLowerCase();
      var formatItems = formatLowerCase.split(_delimiter);
      var dateItems = _date.split(_delimiter);
      var monthIndex = formatItems.indexOf("mm");
      var dayIndex = formatItems.indexOf("dd");
      var yearIndex = formatItems.indexOf("yyyy");
      var month = parseInt(dateItems[monthIndex]);
      month -= 1;

      return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    }
    
  });

  var app = new Application();

  return window.app = app;
});
