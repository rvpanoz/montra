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

    onAttach: function() {
      // this.recordsStatsView = new RecordsStatsView(opts.collection);
    },

    onRender: function() {
      this.showChildView('recordsRegion', new RecordsView());
    },

    onChildFetchRecords: function(opts) {
      var recordsStatsView = new RecordsStatsView(opts.collection);
      this.showChildView('statsRegion', recordsStatsView);
    },

    onChildModelRemoved: function(opts) {
      /** TODO: render stats **/
    }

  });

  return RecordsLayoutView;
});
