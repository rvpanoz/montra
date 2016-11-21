define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  return Marionette.View.extend({
    template: templates.categoryIcons,
    initialize: function() {
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },
    onAttach: function() {
      
      this.$el.append('<option value="0"></option>');
    },
    onDomRefresh: function() {

    }
  });

});
