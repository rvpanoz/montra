define([
  'marionette',
  'schemas/category-schema',
  'views/categoryItemView',
  'templates'
], function(Marionette, CategorySchema, CategoryItemView, templates) {

  return Marionette.CompositeView.extend({
    template: templates.browseCategories,
    className: 'container',
    childView: CategoryItemView,
    childViewContainer: '.categories-items',
    collectionEvents: {
      'sync': '_render'
    },
    events: {
      "click .navigate": "onNavigate"
    },
    onNavigate: function(e) {
      e.preventDefault();
      var cls = this.$(e.currentTarget).data('cls');
      return app.navigate(cls);
    },
    initialize: function() {
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },
    serializedData: function() {
      return _.extend(this.collection.toJSON(), {

      });
    },
    _render: function() {
      this.render();
    }
  });

});
