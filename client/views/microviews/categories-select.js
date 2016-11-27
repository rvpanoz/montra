define([
  'marionette',
  'schemas/category-schema',
  'views/microviews/category-option',
  'templates'
], function(Marionette, CategorySchema, categoryOptionView, templates) {

  return Marionette.CompositeView.extend({
    template: templates.categoriesSelect,
    childView: categoryOptionView,
    childViewContainer: '.items',
    collectionEvents: {
      'sync': 'render'
    },
    childViewEvents: {
      'update:element': 'onUpdateElement'
    },
    initialize: function() {
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },
    onAttach: function() {
      this.triggerMethod('update:element', this.el);
    }
  });

});
