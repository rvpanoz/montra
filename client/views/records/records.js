define([
  'marionette',
  'templates',
  'schemas/record-schema',
  './records-items',
  './filters',
  './details',
  './totals',
  '../../views/components/pagination/pagination'
], function(Marionette, templates, RecordSchema, RecordsView, FiltersView, DetailsView, TotalsView, PaginationView) {
  "use strict";

  var RecordsLayoutView = Marionette.View.extend({
    template: templates.recordsLayout,
    title: 'Records',
    regions: {
      recordsRegion: '#records-content',
      detailsRegion: '#details-content',
      filtersRegion: '#filters-content',
      paginationRegion: '#pagination-content',
      totalsRegion: '#totals-content'
    },
    childViewTriggers: {
      'fetch:records': 'child:fetch:records',
      'model:removed': 'child:model:removed',
      'model:selected': 'child:model:selected',
      'apply:filters': 'child:view:filter',
      'records:paginate': 'child:records:paginate'
    },

    onRender: function() {
      var recordsView = new RecordsView();
      var filtersView = new FiltersView();

      this.showChildView('filtersRegion', filtersView);
      this.showChildView('recordsRegion', recordsView);
    },

    onChildModelSelected: function(model) {
      var recordsView = this.getChildView('recordsRegion');
      var models = _.each(recordsView.collection.models, function(cmodel) {
        if (cmodel !== model) {
          cmodel.set('_selected', false);
        }
      });
      this.showChildView('detailsRegion', new DetailsView({
        model: model
      }));
    },

    onChildRecordsPaginate: function(opts) {
      var page = opts.page || 1;
      var recordsView = this.getChildView('recordsRegion');
      if(recordsView && recordsView.collection) {
        recordsView.collection.trigger('paginate', page);
      }
    },

    onChildFetchRecords: function(collection) {
      var totalsView = this.getChildView('totalsRegion');
      var paginationView = this.getChildView('paginationRegion');

      this.showChildView('paginationRegion', new PaginationView({
        collection: collection
      }));

      this.showChildView('totalsRegion', new TotalsView({
        collection: collection
      }));

      var detailsRegion = this.getRegion('detailsRegion');
      detailsRegion.empty();
    },

    onChildModelRemoved: function(model) {
      var detailsRegion = this.getRegion('detailsRegion');
      detailsRegion.empty();
    },

    onChildViewFilter: function(data) {
      var recordsView = this.getChildView('recordsRegion');
      recordsView.collection.fetch({
        data: data
      });
    },

    serializeData: function() {
      return {
        title: this.title
      }
    }
  });

  return RecordsLayoutView;
});
