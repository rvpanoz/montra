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

    initialize: function() {
      // debugger;
      // this.recordsView = new RecordsView();
      // this.recordsStatsView = new RecordsStatsView();
    },

    onRender: function() {
      var recordsView = new RecordsView();
      var statsView = new RecordsStatsView();

      this.showChildView('statsRegion', statsView);
      this.showChildView('recordsRegion', recordsView);
    },

    onChildFetchRecords: function(opts) {
      
    },

    onChildModelRemoved: function(model) {
      // this.recordsStatsView.collection.remove(model);
    }

  });

  return RecordsLayoutView;
});
