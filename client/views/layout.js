define([
  'marionette',
  'templates',
  '../views/header',
  '../views/drawer'
], function(Marionette, templates, HeaderView, DrawerView) {
  "use strict";

  return Marionette.View.extend({
    className: 'layout-view',
    template: templates.layout,
    regions: {
      headerRegion: '#header-content',
      // drawerRegion: '#drawer-content',
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
      });
    },
    onNavigate: function(e) {
      if (e) {
        e.preventDefault();
      }
      var drawer = this.$('.mdl-layout__drawer');
      var cls = this.$(e.currentTarget).data('cls');

      if (drawer && cls) {
        drawer.toggleClass('is-visible');
        $('nav > a').removeClass('mdl-navigation__link--current');
        $(e.currentTarget).toggleClass('mdl-navigation__link--current');
        this.$('.mdl-layout__obfuscator').removeClass('is-visible');
        app.navigate(cls);
      }
      return false;
    },
    onAttach: function() {
      this.getRegion('headerRegion').show(this.headerView);
      // this.getRegion('drawerRegion').show(this.drawerView);
    },
    onRender: function() {
      this.headerView = new HeaderView();
      // this.drawerView = new DrawerView();
    }
  });

})
