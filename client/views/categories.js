define([
  'marionette',
  'schemas/category-schema',
  'views/categoryItemView',
  'templates'
], function(Marionette, CategorySchema, CategoryItemView, templates) {

  return Marionette.CompositeView.extend({
    // type: 'listHandler',
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
    initialize: function() {
      _.bindAll(this, '_render');
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },
    onNavigate: function(e) {
      e.preventDefault();
      var cls = this.$(e.currentTarget).data('cls');
      return app.navigate(cls);
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
