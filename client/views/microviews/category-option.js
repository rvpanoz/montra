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
    modelEvents: {
      'sync': 'render'
    },
    initialize: function() {
      this.$el.attr('value', this.model.get('_id'));
    }

  });

})
