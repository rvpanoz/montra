define([
  'marionette',
  'templates',
  'schemas/category-schema',
  '../views/categories'
], function(Marionette, templates, CategorySchema, CategoriesView) {
  "use strict";

  var CategoriesLayoutView = Marionette.View.extend({
    template: templates.categoriesLayout,
    regions: {
      categoriesRegion: '#categories-content'
    },
    onRender: function() {
      var categoriesView = new CategoriesView();
      this.showChildView('categoriesRegion', categoriesView);
    }
  });

  return CategoriesLayoutView;
});
