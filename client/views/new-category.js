define([
  'marionette',
  'schemas/category-schema',
  'templates'
], function(Marionette, CategorySchema, templates) {

  return Marionette.View.extend({
    template: templates.newCategory,
    className: 'container',
    bindings: {
      '#input-name': 'name'
    },
    events: {
      'click #category-submit': 'onEventSave'
    },
    initialize: function() {
      this.model = new CategorySchema.model();
    },
    onRender: function() {
      this.stickit();
    },
    onEventSave: function(e) {
      e.preventDefault();
      this.model.save(null, {
        success: _.bind(this.onEventSaveCallback, this)
      });
    },
    onEventSaveCallback: function(model) {
      console.log(model);
    }
  });

});
