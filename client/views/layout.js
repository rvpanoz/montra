define([
  'marionette',
  'templates',
  '../views/header'
], function(Marionette, templates, HeaderView) {
  "use strict";

  var LayoutView =  Marionette.View.extend({
    className: 'layout-view',
    template: templates.layout,
    regions: {
      headerRegion: '#header-content',
      mainRegion: '#main-content'
    },
    events: {
      'click .mdl-navigation__link': 'onNavigate'
    },
    initialize: function() {
      var mainRegion = this.getRegion('mainRegion');

      this.listenTo(app, 'app:view_show', function(View, options) {

        //show the main view
        mainRegion.show(View, options);

        //set the active view
        app.content = View;

        // when the page is completely loaded and rendered
        // I should run componentHandler.upgradeDom() to let MDL render the page.
        componentHandler.upgradeDom();

        $('.mdl-layout__drawer').removeClass('is-visible');
      });

      this.listenTo(app, 'userstate:change', _.bind(function() {
        this.onUpdateUI();
      }, this));

    },

    onNavigate: function(e) {
      e.preventDefault();
      var cls = this.$(e.currentTarget).data('cls');

      if (cls) {
        app.navigate(cls);
      }

      return false;
    },

    onAttach: function() {
      var token = localStorage.getItem('token');
      this.getRegion('headerRegion').show(this.headerView);
      this.onUpdateUI();
    },

    onRender: function() {
      this.headerView = new HeaderView();
    },

    onUpdateUI: function() {
      var token = localStorage.getItem('token');

      this.headerView.$el.hide();
      this.$('.mntr-header').hide();
      this.$('.mntr-drawer').hide();

      if(token) {
        this.headerView.$el.show();
        this.$('.mntr-header').show();
        this.$('.mntr-drawer').show();
      }

    }

  });

  return LayoutView;
});
