define([
  'marionette',
  'schemas/category-schema',
  'templates',
  'moment'
], function (Marionette, CategorySchema, templates, moment) {
  'use strict';

  var CategoryView = Marionette.View.extend({
    template: templates.categoryDetailView,
    model: new CategorySchema.model(),
    modelEvents: {
      'sync': '_render'
    },
    initialize: function (params) {
      _.bindAll(this, '_render');

      if (params.id) {
        this.model.set('_id', params.id);
        this.model.fetch();
      }
    },
    _render: function () {
      this.render();
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
