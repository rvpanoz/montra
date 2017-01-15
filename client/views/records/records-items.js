define([
  'marionette',
  'schemas/record-schema',
  'schemas/category-schema',
  './record-item',
  'moment',
  'templates',
  'datepicker'
], function(Marionette, RecordSchema, CategorySchema, RecordItemView, moment, templates) {

  return Marionette.CompositeView.extend({
    title: 'Your records',
    selected: [],
    page: 1,
    perPage: 12,
    template: templates.browseRecords,
    childView: RecordItemView,
    childViewContainer: '.records-items',
    childViewTriggers: {
      'clone:model': 'child:clone:model',
      'select:model': 'child:select:model'
    },
    collectionEvents: {
      'paginate': 'onPaginate',
      'sync': 'onSync',
      'remove': 'onRemove'
    },
    events: {
      'click a.btn-new': 'onNew',
      'click a.select-all': 'onSelectAll',
      'click a.select-none': 'onSelectNone',
      'click .pagination-number': 'onPaginate',
      'click .pagination-arrow': 'onPaginate',
      'click .navigate': 'onNavigate',
      'click a.sort': 'onSort',
      'click a.update': 'onUpdate',
      'click button.search': 'onSearch',
      'click button.clear': 'onClearSearch'
    },
    ui: {
      searchForm: '.datalist-filter',
      inputEntryDateFrom: '#input-entry-date-from',
      inputEntryDateTo: '#input-entry-date-to',
      inputCategory: '#input-category'
    },

    initialize: function() {
      _.bindAll(this, 'onSync');
      this.collection = new RecordSchema.collection();
      this.categories = new CategorySchema.collection();
      this.collection.fetch({
        data: {
          page: 1
        },
        success: _.bind(function() {
          // this.triggerMethod("fetch:records", this.collection);
        }, this)
      });
    },

    _getSelectedModels: function() {
      var selected = _.filter(this.collection.models, function(model) {
        return model.get('_selected') == true;
      });
      return selected;
    },

    onRender: function() {
      console.log('records-items render');
    },

    onPaginate: function(page) {
      this.collection.fetch({
        data: {
          page: page
        }
      });
    },

    onSelectAll: function(e) {
      e.preventDefault();
      var target = this.$(e.currentTarget);
      _.each(this.collection.models, function(model) {
        model.set('_selected', true);
      });
      return false;
    },

    onSelectNone: function(e) {
      e.preventDefault();
      var target = this.$(e.currentTarget);
      _.each(this.collection.models, function(model) {
        model.set('_selected', false);
      });
      return false;
    },

    onChildSelectModel: function(model) {
      this._selected = [];
      this._selected = this._getSelectedModels();
    },

    onRemove: function(model, collection) {
      this.triggerMethod('model:removed', model);
    },

    onSync: function() {
      this.triggerMethod('fetch:records', this.collection);
      this.render();
    },

    serializeData: function() {
      return _.extend(this.collection.toJSON(), {
        title: this.title
      });
    }
  });

});
