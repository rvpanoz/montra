define([
  'marionette',
  'schemas/category-schema',
  'templates',
  'moment'
],function(Marionette, CategorySchema, templates, moment) {

  var CategoryItemView = Marionette.View.extend({
    template: templates.categoryItemView,
    tagName: 'tr',
    events: {
      'click .update': 'onEventUpdate',
      'click .remove': 'onEventRemove'
    },
    ui: {
      'buttonUpdate': '.update',
      'buttonRemove': '.remove'
    },

    onEventUpdate: function(e) {
      e.preventDefault();
      app.navigate('category', {
        id: this.model.get('_id')
      });
    },

    onEventRemove: function(e) {
      e.preventDefault();
      var id = this.model.get('_id');
      this.model.set('id', id);
      this.model.destroy({
        wait: true
      });
      return false;
    },

    serializeData: function() {
      var dc = this.model.get('created_at');
      var du = this.model.get('updated_at');

      return _.extend(this.model.toJSON(), {
        'date_created': moment(dc).format('DD/MM/YYYY HH:mm'),
        'date_updated': moment(du).format('DD/MM/YYYY HH:mm')
      });
    }
  });

  return CategoryItemView;
});
