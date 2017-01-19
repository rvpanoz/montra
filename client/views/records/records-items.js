define([
  'config',
  'marionette',
  'schemas/record-schema',
  'schemas/category-schema',
  './record-item',
  'moment',
  'templates',
  'datepicker',
  'datatables.net',
  'datatables.net-bs'
], function(config, Marionette, RecordSchema, CategorySchema, RecordItemView, moment, templates) {

  return Marionette.CompositeView.extend({
    perPage: config.perPage,
    template: templates.browseRecords,
    childView: RecordItemView,
    childViewContainer: '.records-items',
    childViewTriggers: {
      'clone:model': 'child:clone:model',
      'model:selected': 'child:selected:model'
    },
    collectionEvents: {
      'sync': 'onSync',
      'remove': 'onRemove'
    },
    ui: {
      'records-table': '.records-table'
    },
    initialize: function() {
      _.bindAll(this, 'onSync');
      this.title = 'Your records';
      this.collection = new RecordSchema.collection();
      this.categories = new CategorySchema.collection();
      this.collection.fetch();
    },

    onRender: function() {
      if(this.$el.length) {
        this.getUI('records-table').DataTable({
          paging: false,
          ordering: false
        });
      }
    },

    getSelectedModels: function() {
      var selected = _.filter(this.collection.models, function(model) {
        return model.get('_selected') == true;
      });
      return selected;
    },

    onChildSelectedModel: function(model) {
      var selected = this.getSelectedModels();
      var hide = selected.length > 1;
      this.triggerMethod('toggle:details', hide);
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
