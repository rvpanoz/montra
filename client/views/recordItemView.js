define([
  'marionette',
  'schemas/record-schema',
  'views/add',
  'templates',
  'moment'
],function(Marionette, RecordSchema, AddView, templates, moment) {

  var RecordItemView = Marionette.View.extend({
    template: templates.recordItemView,
    tagName: 'li',
    className: 'list-group-item',
    events: {
      'click': 'onEventClick'
    },
    onEventClick: function(e) {
      e.preventDefault();
      app.navigate('recordDetailView', {
        id: this.model.get('_id')
      });
    },
    serializeData: function(){
      var d = this.model.get('created_at');
      return _.extend(this.model.toJSON(), {
        'date_created': moment(d).format('DD/MM/YYYY HH:mm')
      });
    }
  });

  return RecordItemView;
});
