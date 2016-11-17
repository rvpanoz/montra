define([
  'marionette',
  'schemas/category-schema',
  'templates',
  'moment'
],function(Marionette, CategorySchema, templates, moment) {

  var CategoryItemView = Marionette.View.extend({
    template: templates.categoryItemView,
    events: {
      'click': 'onEventClick'
    },
    onEventClick: function(e) {
      e.preventDefault();
      app.navigate('view-category', {
        id: this.model.get('_id')
      });
    },
    serializeData: function() {
      var d = this.model.get('created_at');
      return _.extend(this.model.toJSON(), {
        'date_created': moment(d).format('DD/MM/YYYY HH:mm')
      });
    }
  });

  return CategoryItemView;
});
