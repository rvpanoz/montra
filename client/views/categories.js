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
      'sync': '_render'
    },
    events: {
      'click .navigate': 'onNavigate',
      'click .add': 'onEventAdd'
    },
    initialize: function() {
      _.bindAll(this, '_render');
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },
    onNavigate: function(e) {
      e.preventDefault();
      var cls = $(e.currentTarget).data('cls');
      if(cls) {
        app.navigate(cls);
      }
      return false;
    },
    onEventAdd: function(e) {
      e.preventDefault();
      app.navigate('category');
      return false;
    },
    _render: function() {
      this.render();
    },
    serializedData: function() {
      return _.extend(this.collection.toJSON(), {

      });
    }
  });

});
