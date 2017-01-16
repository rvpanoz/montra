define([
  'marionette',
  'templates',
  '../../schemas/record-schema',
  'moment'
], function(Marionette, templates, RecordSchema, moment) {

  var DetailItemView = Marionette.View.extend({
    template: templates.detailsRecord,
    className: 'details-preview datalist-preview',
    events: {
      'click .update': 'onUpdate',
      'click .remove': 'onRemove'
    },
    onUpdate: function(e) {
      e.preventDefault();
      return app.navigate('records/record', {
        id: this.model.get('_id')
      });
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
      var date_formatted = moment(new Date(this.model.get('entry_date'))).format('DD/MM/YYYY');
      var k = this.model.get('kind');
      var p = this.model.get('payment_method');

      return _.extend(this.model.toJSON(), {
        'entry_date_formatted': date_formatted,
        'kind_descr': (k == 1) ? 'Expense' : 'Income',
        'payment_method_descr': (p == 1) ? 'Cash' : 'Credit card'
      });
    }
  });

  return DetailItemView;
})
