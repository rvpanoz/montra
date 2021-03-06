define([
  'config',
  'backbone',
  'marionette',
  'router',
  'views/layout'
], function(config, Backbone, Marionette, Router, LayoutView) {
  'use strict';

  var Application = Marionette.Application.extend({
    isAdmin: false,
    content: null,
    pagination: false,
    region: '#app-content',
    baseUrl: config.baseUrl + ":" + config.port,
    publicUrls: ['login', 'register'],

    onBeforeStart: function() {
      this.router = new Router();
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

    onSignin: function(token) {
      if (token) {
        localStorage.setItem('token', token);
        app.token = token;

        app.onAppEvent('userstate:change');
        app.navigate('home');
      }
      return false;
    },

    onSignout: function() {
      localStorage.removeItem('token');
      app.token = null;
      app.onAppEvent('userstate:change');
      app.navigate('login');
      return false;
    },

    checkState: function() {
      return localStorage.get('token');
    },

    wait: function(active, t) {
      var spinner = $('#circlesLoader');
      var tm = (t) ? 1000 : 1500;

      if (active == true) {
        $('.app-container').css({
          opacity: 0.5
        });
        spinner.show();
      } else if (active == false) {
        setTimeout(function() {
          spinner.hide();
          $('.app-container').css({
            opacity: 1
          });
        }, tm);
      }
    },

    showMessage: function(message, html) {
      var snackbar = $('.snack-wrap');

      //show snackbar
      snackbar.children().each(function(idx, child) {
        $(child).addClass('animated');
      });

      //update message
      snackbar.find('.snackbar').text(message);

      //hide snackbar
      setTimeout(_.bind(function() {
        this.hideMessage();
      }, this), 5000);
    },

    hideMessage: function() {
      var snackbar = $('.snack-wrap');
      snackbar.children().each(function(idx, child) {
        $(child).removeClass('animated');
      });
      snackbar.find('.snackbar').text('');
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
