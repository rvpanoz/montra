define([
  'marionette',
  'templates',
  'schemas/category-schema',
  './categories-items',
  './details'
], function(Marionette, templates, CategorySchema, CategoriesView, DetailsView) {
  "use strict";

  var CategoriesLayoutView = Marionette.View.extend({
    template: templates.categoriesLayout,
    title: 'Categories',
    regions: {
      categoriesRegion: '#categories-content',
      detailsRegion: '#details-content'
    },
    childViewTriggers: {
      'model:selected': 'child:model:selected'
    },
    onRender: function() {
      var categoriesView = new CategoriesView();
      this.showChildView('categoriesRegion', categoriesView);
    },
    onChildModelSelected: function(model) {
      var categoriesView = this.getChildView('categoriesRegion');
      _.each(categoriesView.collection.models, function(cmodel) {
        if (cmodel !== model) {
          cmodel.set('_selected', false);
        }
      });
      this.showChildView('detailsRegion', new DetailsView({
        model: model
      }));
    },
    serializeData: function() {
      return {
        title: this.title
      }
    }
  });

  return CategoriesLayoutView;
});
