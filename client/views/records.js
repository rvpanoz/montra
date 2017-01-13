define([
  'marionette',
  'templates',
  'schemas/record-schema',
  '../views/records-items',
  '../views/recordsStatsView'
], function(Marionette, templates, RecordSchema, RecordsView, RecordsStatsView) {
  "use strict";

  var RecordsLayoutView = Marionette.View.extend({
    template: templates.recordsLayout,
    title: 'Records',
    regions: {
      // statsRegion: '#stats-content',
      recordsRegion: '#records-content'
    },
    events: {

    },
    childViewTriggers: {
      'fetch:records': 'child:fetch:records',
      'model:removed': 'child:model:removed'
    },

    onRender: function() {
      var recordsView = new RecordsView();
      // var statsView = new RecordsStatsView();

      // this.showChildView('statsRegion', statsView);
      this.showChildView('recordsRegion', recordsView);
    },

    onAttach: function() {
      // app.switchSidebarCtx();
    },

    onChildFetchRecords: function(collection) {
      // this.getChildView('statsRegion').collection.reset(collection.allRecords);
      // this.getChildView('statsRegion').render();
    },

    onChildModelRemoved: function(model) {
      // var statsView = this.getChildView('statsRegion');
      var models = _.filter(statsView.collection.models, function(m) {
        return m.get('_id') != model.get('_id');
      });
      if(models.length) {
        // statsView.collection.reset(models);
      }
    },

    serializeData: function() {
      return {
        title: this.title
      }
    }
  });

  return RecordsLayoutView;
});
