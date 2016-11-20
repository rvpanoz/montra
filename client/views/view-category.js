define([
  'marionette',
  'schemas/category-schema',
  'templates',
  'moment'
], function (Marionette, CategorySchema, templates, moment) {
  'use strict';

  var CategoryView = Marionette.View.extend({
    template: templates.categoryDetailView,
    modelEvents: {
      'sync': '_render'
    },
    events: {
      'click .btn-update': 'onEventUpdate',
      'click .btn-delete': 'onEventDelete'
    },
    initialize: function (params) {
      _.bindAll(this, '_render');
      this.model = new CategorySchema.model();

      if (params.id) {
        this.model.set('_id', params.id);
        this.model.fetch();
      }
    },
    _render: function () {
      this.render();
    },
    onEventUpdate: function(e) {
      e.preventDefault();
      app.navigate('category', {
        id: this.model.get('_id')
      });
    },
    onEventDelete: function(e) {
      e.preventDefault();
      this.model.destroy({
        success: _.bind(function(removed_category) {
          app.navigate('categories');
          return false;
        })
      });
    },
    serializeData: function(){
      var d = this.model.get('created_at');
      return _.extend(this.model.toJSON(), {
        'date_created': moment(d).format('DD/MM/YYYY HH:mm')
      });
    }
  });

  return CategoryView;
});
