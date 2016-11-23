define([
  'marionette',
  'templates',
  '../views/header',
  '../views/footer'
], function(Marionette, templates, HeaderView, FooterView) {
  "use strict";

  return Marionette.View.extend({
    template: templates.layout,
    className: 'ma-view',
    regions: {
      headerRegion: '#header-content',
      footerRegion: '#footer-content',
      mainRegion: '#main-content'
    },
    initialize: function() {
      var mainRegion = this.getRegion('mainRegion');
      var footerRegion = this.getRegion('footerRegion');

      this.listenTo(app, 'app:view_show', function(View, options) {

        //add css class
        View.$el.addClass('container');

        //show the main view
        mainRegion.show(View, options);
      });
    },

    onRender: function() {
      //header view
      var headerView = new HeaderView();
      this.getRegion('headerRegion').show(headerView);
    }
  });

})
