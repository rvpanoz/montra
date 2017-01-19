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
      'paginate': 'child:records:paginate',
      'toggle:details': 'child:toggle:details'
    },
    events: {
      'click .new': 'onNew'
    },

    onNew: function(e) {
      e.preventDefault();
      return app.navigate('records/record');
    },

    onAttach: function() {
      this.triggerMethod('sidebar:active', 1);
    },

    onRender: function() {
      var recordsView = new RecordsView();
      var filtersView = new FiltersView();

      this.showChildView('filtersRegion', filtersView);
      this.showChildView('recordsRegion', recordsView);
    },

    onChildModelSelected: function(model) {
      var detailsView = this.getChildView('detailsRegion');
      detailsView.model = model;
      detailsView.render();
    },

    onChildToggleDetails: function(hide) {
      var detailsView = this.getChildView('detailsRegion');
    },

    onChildRecordsPaginate: function(page) {
      var pagination = this.getChildView('paginationRegion');
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
      this.collection = collection;
      var paginationView = this.getChildView('paginationRegion');
      var model = this.collection.first();
      var totalsView = this.getChildView('totalsRegion');
      var detailsView = this.getChildView('detailsRegion');

      model.set('_selected', true);

      this.showChildView('paginationRegion', new PaginationView({
        collection: collection
      }));

      this.showChildView('totalsRegion', new TotalsView({
        collection: collection
      }));

      if(!detailsView) {
        this.showChildView('detailsRegion', new DetailsView({
          model: model
        }));
      }

      app.triggerMethod("sidebar:switch", "actions");
    },

    onChildModelRemoved: function(model) {
      // var detailsRegion = this.getRegion('detailsRegion');
      // detailsRegion.empty();
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
