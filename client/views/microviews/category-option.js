define([
  'marionette',
  'schemas/category-schema',
  'templates'
], function(Marionette, CategorySchema, templates) {
  "use strict";

  return Marionette.View.extend({
    template: templates.categoryOption,
    tagName: 'option',
    model: CategorySchema.model,
    attributes: function() {
      return {
        value: this.model.get('_id')
      }
    },
    modelEvents: {
      'sync': 'render'
    }
  });

})
