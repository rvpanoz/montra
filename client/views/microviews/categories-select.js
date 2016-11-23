define([
  'marionette',
  'schemas/category-schema',
  'views/microviews/category-option',
  'templates'
], function(Marionette, CategorySchema, categoryOptionView, templates) {

  return Marionette.CollectionView.extend({
    template: templates.categoriesSelect,
    childView: categoryOptionView,
    tagName: 'select',
    id: 'input-category',
    className: 'form-control',
    collectionEvents: {
      'sync': 'render'
    },
    initialize: function() {
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },
    onAttach: function() {
      this.$el.append('<option value="0">Select category</option>');
    },
    onDomRefresh: function() {

    }
  });

});
