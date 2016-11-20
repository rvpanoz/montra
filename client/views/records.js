define([
  'marionette',
  'schemas/record-schema',
  'views/recordItemView',
  'templates'
], function(Marionette, RecordSchema, RecordItemView, templates) {

  return Marionette.CompositeView.extend({
    template: templates.browseRecords,
    className: 'container',
    childView: RecordItemView,
    childViewContainer: '.records-items',
    collectionEvents: {
      'sync': '_render'
    },
    events: {
      "click .navigate": "onNavigate"
    },
    initialize: function() {
      _.bindAll(this, '_render');
      this.collection = new RecordSchema.collection();
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
