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
      if (token) {
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

      if (active == true) {
        spinner.addClass('is-active');
        $('.mdl-layout__obfuscator').addClass('is-visible');
      } else if (active == false) {
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
    },

    initializeJS: function() {

      //tool tips
      jQuery('.tooltips').tooltip();

      //popovers
      jQuery('.popovers').popover();

      //custom scrollbar
      //for html
      jQuery("html").niceScroll({
        styler: "fb",
        cursorcolor: "#007AFF",
        cursorwidth: '6',
        cursorborderradius: '10px',
        background: '#F7F7F7',
        cursorborder: '',
        zindex: '1000'
      });
      //for sidebar
      jQuery("#sidebar").niceScroll({
        styler: "fb",
        cursorcolor: "#007AFF",
        cursorwidth: '3',
        cursorborderradius: '10px',
        background: '#F7F7F7',
        cursorborder: ''
      });
      // for scroll panel
      jQuery(".scroll-panel").niceScroll({
        styler: "fb",
        cursorcolor: "#007AFF",
        cursorwidth: '3',
        cursorborderradius: '10px',
        background: '#F7F7F7',
        cursorborder: ''
      });

      //sidebar dropdown menu
      jQuery('#sidebar .sub-menu > a').click(function() {
        var last = jQuery('.sub-menu.open', jQuery('#sidebar'));
        jQuery('.menu-arrow').removeClass('arrow_carrot-right');
        jQuery('.sub', last).slideUp(200);
        var sub = jQuery(this).next();
        if (sub.is(":visible")) {
          jQuery('.menu-arrow').addClass('arrow_carrot-right');
          sub.slideUp(200);
        } else {
          jQuery('.menu-arrow').addClass('arrow_carrot-down');
          sub.slideDown(200);
        }
        var o = (jQuery(this).offset());
        diff = 200 - o.top;
        if (diff > 0)
          jQuery("#sidebar").scrollTo("-=" + Math.abs(diff), 500);
        else
          jQuery("#sidebar").scrollTo("+=" + Math.abs(diff), 500);
      });

      // sidebar menu toggle
      jQuery(function() {
        function responsiveView() {
          var wSize = jQuery(window).width();
          if (wSize <= 768) {
            jQuery('#container').addClass('sidebar-close');
            jQuery('#sidebar > ul').hide();
          }

          if (wSize > 768) {
            jQuery('#container').removeClass('sidebar-close');
            jQuery('#sidebar > ul').show();
          }
        }
        jQuery(window).on('load', responsiveView);
        jQuery(window).on('resize', responsiveView);
      });

      jQuery('.toggle-nav').click(function() {
        if (jQuery('#sidebar > ul').is(":visible") === true) {
          jQuery('#main-content').css({
            'margin-left': '0px'
          });
          jQuery('#sidebar').css({
            'margin-left': '-180px'
          });
          jQuery('#sidebar > ul').hide();
          jQuery("#container").addClass("sidebar-closed");
        } else {
          jQuery('#main-content').css({
            'margin-left': '180px'
          });
          jQuery('#sidebar > ul').show();
          jQuery('#sidebar').css({
            'margin-left': '0'
          });
          jQuery("#container").removeClass("sidebar-closed");
        }
      });

      //bar chart
      if (jQuery(".custom-custom-bar-chart")) {
        jQuery(".bar").each(function() {
          var i = jQuery(this).find(".value").html();
          jQuery(this).find(".value").html("");
          jQuery(this).find(".value").animate({
            height: i
          }, 2000)
        })
      }

    }


  });

  var app = new Application();

  return window.app = app;
});
