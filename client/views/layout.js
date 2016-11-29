define([
  'marionette',
  'templates',
  '../views/header',
  '../views/sidebar'
], function(Marionette, templates, HeaderView, SidebarView) {
  "use strict";

  return Marionette.View.extend({
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
      });
    },
    onNavigate: function(e) {
      if (e) {
        e.preventDefault();
      }
      var cls = this.$(e.currentTarget).data('cls');
      if (cls) {
        app.navigate(cls);
      }
      var drawer = this.$('.mdl-layout__drawer');
      if (drawer) {
        drawer.toggleClass('is-visible');
        this.$('.mdl-layout__obfuscator').toggleClass('is-visible')
      }
      return false;
    },
    onAttach: function() {
      this.getRegion('headerRegion').show(this.headerView);
    },
    onRender: function() {
      this.headerView = new HeaderView();
    }
  });

})
