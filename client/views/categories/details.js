define([
  'marionette',
  'templates',
  '../../schemas/record-schema',
  'moment'
], function(Marionette, templates, RecordSchema, moment) {

  var DetailItemView = Marionette.View.extend({
    template: templates.detailsCategory,
    className: 'details-preview datalist-preview',
    events: {
      'click .update': 'onUpdate',
      'click .remove': 'onRemove'
    },

    onUpdate: function(e) {
      e.preventDefault();
      app.navigate('categories/category', {
        id: this.model.get('_id')
      });
      return false;
    },

    onRemove: function(e) {
      e.preventDefault();
      var id = this.model.get('_id');
      this.model.set('id', id);
      this.model.destroy({
        wait: true
      });
      return false;
    },
    serializeData: function() {
      var date_formatted = moment(new Date(this.model.get('created_at'))).format('DD/MM/YYYY');
      return _.extend(this.model.toJSON(), {
        'created_at_formatted': date_formatted
      });
    }
  });

  return DetailItemView;
})
