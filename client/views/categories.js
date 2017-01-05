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
      'sync': 'render'
    },
    events: {
      'click button.btn-new': 'onNew'
    },

    initialize: function() {
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },

    onNew: function(e) {
      e.preventDefault();
      app.navigate('category');
      return false;
    },

    serializeData: function() {
      var style = (this.collection.length == 0) ? 'display:none' : 'display:block';
      return _.extend(this.collection.toJSON(), {
        records: {
          style: style
        },
        stats: {
          total: this.collection.length
        }
      });
    }
  });

});
