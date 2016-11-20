define([
  'marionette',
  'templates',
  '../views/header'
], function(Marionette, templates, HeaderView) {
  "use strict";

  return Marionette.View.extend({
    template: templates.layout,
    className: 'ma-view',
    regions: {
      headerRegion: '#header-content',
      mainRegion: '#main-content'
    },
    initialize: function() {

      var mainRegion = this.getRegion('mainRegion');

      this.listenTo(app, 'app:view_show', function(View, options) {
        View.$el.addClass('container-fluid');
        mainRegion.show(View, options);
      });

    },
    onRender: function() {

      //header view
      var headerView = new HeaderView();

      //show header view
      this.getRegion('headerRegion').show(headerView);
    }
  });

})
