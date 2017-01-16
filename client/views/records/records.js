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
      'paginate': 'child:records:paginate'
    },
    events: {
      'click .new': 'onNew'
    },

    onNew: function(e) {
      e.preventDefault();
      return app.navigate('records/record');
    },

    onRender: function() {
      var recordsView = new RecordsView();
      this.showChildView('recordsRegion', recordsView);

      var filtersView = new FiltersView();
      this.showChildView('filtersRegion', filtersView);
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

    onChildRecordsPaginate: function(page) {
      var recordsView = this.getChildView('recordsRegion');

      if(this.query) {
        this.query.page = page;
      }

      if(recordsView && recordsView.collection) {
        var collection = recordsView.collection;
        collection.fetch({
          data: (this.query) ? this.query : {
            page: page
          }
        });
      }
    },

    onChildFetchRecords: function(collection) {
      var paginationView = this.getChildView('paginationRegion');
      this.showChildView('paginationRegion', new PaginationView({
        collection: collection
      }));

      var totalsView = this.getChildView('totalsRegion');
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

    onChildViewFilter: function(opts) {
      this.query = opts.data;
      var recordsView = this.getChildView('recordsRegion');
      recordsView.collection.fetch({
        data: this.query
      });
      return false;
    },

    serializeData: function() {
      return {
        title: this.title
      }
    }
  });

  return RecordsLayoutView;
});
