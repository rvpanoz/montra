define([
  'marionette',
  'templates',
  'schemas/record-schema',
  '../views/records',
  '../views/recordsStatsView'
], function(Marionette, templates, RecordSchema, RecordsView, RecordsStatsView) {
  "use strict";

  var RecordsLayoutView = Marionette.View.extend({
    template: templates.recordsLayout,
    regions: {
      statsRegion: '#stats-content',
      recordsRegion: '#records-content'
    },
    collectionEvents: {
      'sync': 'render',
      'sort': 'render'
    },
    childViewTriggers: {
      'fetch:records': 'child:fetch:records',
      'model:removed': 'child:model:removed'
    },

    onRender: function() {
      this.showChildView('recordsRegion', new RecordsView());
    },

    onChildFetchRecords: function(collection) {
      this.recordsStatsView = new RecordsStatsView(collection);
      this.showChildView('statsRegion', this.recordsStatsView);
    },

    onChildModelRemoved: function() {
      this.render();
    }

  });

  return RecordsLayoutView;
});
