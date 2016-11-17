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
