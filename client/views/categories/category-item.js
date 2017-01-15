define([
  'marionette',
  'schemas/category-schema',
  'templates',
  'moment'
],function(Marionette, CategorySchema, templates, moment) {

  var CategoryItemView = Marionette.View.extend({
    template: templates.categoryItemView,
    className: 'category-item',
    tagName: 'tr',
    attributes: {
      role: 'row'
    },
    events: {
      'click': 'onClick',
    },

    onClick: function(e) {
      e.preventDefault();
      var isSelected = this.$el.toggleClass('selected');
      this.model.set('_selected', this.$el.hasClass('selected'));
      this.triggerMethod('model:selected', this.model);
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
