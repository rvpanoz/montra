define([
  'marionette',
  'schemas/category-schema',
  'views/categoryItemView',
  'templates'
], function(Marionette, CategorySchema, CategoryItemView, templates) {

  return Marionette.CompositeView.extend({
    template: templates.browseCategories,
    className: 'container',
    childView: CategoryItemView,
    childViewContainer: '.categories-items',
    collectionEvents: {
      'sync': 'render'
    },
    initialize: function() {
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },
  });

});
