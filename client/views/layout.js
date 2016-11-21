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
    events: {
      'click #btn-save': '_onSave'
    },
    initialize: function() {
      _.bindAll(this, '_onSave');

      var mainRegion = this.getRegion('mainRegion');
      var footerRegion = this.getRegion('footerRegion'), footerView = null;

      this.listenTo(app, 'app:view_show', function(View, options) {

        //add cls class
        View.$el.addClass('container');

        //show the main view
        mainRegion.show(View, options);

        if (View.type) {
          footerView = new FooterView({
            handler: View.type // listHanlder || formHanlder
          });

          //show footer view
          footerRegion.show(footerView);

        } else {
          //clear footer if not View.type
          footerRegion.empty();
        }

      });

    },
    _onSave: function(e) {
      e.preventDefault()
      app.onAppEvent('form:save');
      return false;
    },
    onRender: function() {
      //header view
      var headerView = new HeaderView();

      //show header view
      this.getRegion('headerRegion').show(headerView);
    },

  });

})
