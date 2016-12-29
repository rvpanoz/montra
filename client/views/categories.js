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
      'click .navigate': 'onNavigate'
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
        return app.navigate(cls);
      }
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
