define([
  'marionette',
  'templates',
  'schemas/category-schema',
  '../views/categories-items'
], function(Marionette, templates, CategorySchema, CategoriesView) {
  "use strict";

  var CategoriesLayoutView = Marionette.View.extend({
    template: templates.categoriesLayout,
    title: 'Categories',
    regions: {
      categoriesRegion: '#categories-content'
    },
    onRender: function() {
      var categoriesView = new CategoriesView();
      this.showChildView('categoriesRegion', categoriesView);
    },
    serializeData: function() {
      return {
        title: this.title
      }
    }
  });

  return CategoriesLayoutView;
});
