define([
  'marionette',
  'schemas/record-schema',
  'views/recordItemView',
  'templates'
], function(Marionette, RecordSchema, RecordItemView, templates) {

  return Marionette.CollectionView.extend({
    template: templates.recordListView,
    childView: RecordItemView
  });

});
