define([
  'marionette',
  'schemas/category-schema',
  'views/categoryItemView',
  'templates'
], function(Marionette, CategorySchema, CategoryItemView, templates) {

  return Marionette.CompositeView.extend({
    template: templates.browseCategories,
    childView: CategoryItemView,
    childViewContainer: '.categories-items',
    collectionEvents: {
      'sync': 'render'
    },
    events: {
      'click button.new': 'onNew'
    },

    initialize: function() {
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },

    onNew: function(e) {
      e.preventDefault();
      app.navigate('category');
      return false;
    },

    serializedData: function() {
      return _.extend(this.collection.toJSON(), {

      });
    }
  });

});
