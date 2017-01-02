define([
  'marionette',
  'templates',
  '../views/sidebar',
  '../views/header'
], function(Marionette, templates, SidebarView, NavbarView) {
  "use strict";

  var LayoutView =  Marionette.View.extend({
    template: templates.layout,
    className: 'layout-view',
    regions: {
      navbarRegion: '#navbar',
      sidebarRegion: '#sidebar',
      mainRegion: '#main-content'
    },
    events: {
      'click .signout': 'onSignout'
    },
    initialize: function() {
      var mainRegion = this.getRegion('mainRegion');

      this.listenTo(app, 'app:view_show', function(View, params) {

        //show the main view
        this.showChildView('mainRegion', new View(params));

        //remove obs
        app.wait(false, true);
      });

      this.listenTo(app, 'userstate:change', _.bind(function() {
        $('#sidebar').toggle();
        $('#navbar').toggle();
      }, this));

    },

    onSignout: function(e) {
      if(e) {
        e.preventDefault();
      }

      app.trigger('app:signout');
      return false;
    },

    initializeJS: function() {


        //tool tips
        $('.tooltips').tooltip();

        //popovers
        $('.popovers').popover();

        //custom scrollbar
        //for html
        $("html").niceScroll({
          styler: "fb",
          cursorcolor: "#007AFF",
          cursorwidth: '6',
          cursorborderradius: '10px',
          background: '#F7F7F7',
          cursorborder: '',
          zindex: '1000'
        });
        //for sidebar
        $("#sidebar").niceScroll({
          styler: "fb",
          cursorcolor: "#007AFF",
          cursorwidth: '3',
          cursorborderradius: '10px',
          background: '#F7F7F7',
          cursorborder: ''
        });
        // for scroll panel
        $(".scroll-panel").niceScroll({
          styler: "fb",
          cursorcolor: "#007AFF",
          cursorwidth: '3',
          cursorborderradius: '10px',
          background: '#F7F7F7',
          cursorborder: ''
        });

        $(".sidebar-toggle").bind("click", function(e) {
          $("#sidebar").toggleClass("active");
          $(".app-container").toggleClass("__sidebar");
        });

        $(".navbar-toggle").bind("click", function(e) {
          $("#navbar").toggleClass("active");
          $(".app-container").toggleClass("__navbar");
        });

        $('.sidebar-nav .navigation-link').bind('click', function(e) {
          $("#sidebar").toggleClass("active");
          return true;
        });

    },
    onAttach: function() {
      var token = localStorage.getItem('token');
      this.initializeJS();
    },

    onRender: function() {
      this.showChildView('sidebarRegion', new SidebarView());
      this.showChildView('navbarRegion', new NavbarView());
    }

  });

  return LayoutView;
});
