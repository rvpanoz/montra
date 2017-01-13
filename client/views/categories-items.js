define([
  'marionette',
  'schemas/category-schema',
  'views/categoryItemView',
  'templates'
], function(Marionette, CategorySchema, CategoryItemView, templates) {

  return Marionette.CompositeView.extend({
    title: 'Your categories',
    template: templates.browseCategories,
    childView: CategoryItemView,
    childViewContainer: '.categories-items',
    childViewTriggers: {
      'select:model': 'child:select:model'
    },
    collectionEvents: {
      'sync': 'render'
    },
    events: {
      'click a.btn-new': 'onNew',
      'click a.btn-update': 'onUpdate'
    },

    initialize: function() {
      this.collection = new CategorySchema.collection();
      this.collection.fetch();
    },

    _getSelectedModels: function() {
      var selected = _.filter(this.collection.models, function(model) {
        return model.get('_selected') == true;
      });
      return selected;
    },

    onNew: function(e) {
      e.preventDefault();
      app.navigate('category');
      return false;
    },

    onUpdate: function(e) {
      e.preventDefault();
      var selected = this._getSelectedModels();
      if(selected.length > 1) {
        return;
      }
      app.navigate('category', {
        id: _.first(selected).get('_id')
      });
      return false;
    },

    onSelectAll: function(e) {
      e.preventDefault();
      var target = this.$(e.currentTarget);
      _.each(this.collection.models, function(model) {
        model.set('_selected', true);
      });
      target.closest('.button-group').toggleClass('open');
      return false;
    },

    onSelectNone: function(e) {
      e.preventDefault();
      var target = this.$(e.currentTarget);
      _.each(this.collection.models, function(model) {
        model.set('_selected', false);
      });
      target.closest('.button-group').toggleClass('open');
      return false;
    },

    onChildSelectModel: function(model) {
      this._selected = [];
      this._selected = this._getSelectedModels();
      if(this._selected.length > 1) {
        this.getUI('actions').hide();
        return;
      }
      this.getUI('actions').toggle();
    },

    serializeData: function() {
      var style = (this.collection.length == 0) ? 'display:none' : 'display:block';
      return _.extend(this.collection.toJSON(), {
        title: this.title,
        records: {
          style: style
        },
        stats: {
          total: this.collection.length
        }
      });
    }
  });

});
