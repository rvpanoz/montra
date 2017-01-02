define([
  'marionette',
  'schemas/category-schema',
  'templates',
  'moment'
],function(Marionette, CategorySchema, templates, moment) {

  var RecordItemView = Marionette.View.extend({
    template: templates.recordItemView,
    className: 'ticket-item',
    tagName: 'li',
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
      app.navigate('record', {
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
      var d = this.model.get('entry_date');
      var k = this.model.get('kind');
      var p = this.model.get('payment_method');
      return _.extend(this.model.toJSON(), {
        'entry_date_formatted': moment(new Date(d)).format('DD/MM/YYYY'),
        'kind_descr': (k == 1) ? 'Expense' : 'Income',
        'kind_color': (k == 1) ? 'red' : 'green',
        'kind_check': (k == 1) ? 'times' : 'check',
        'payment_check': (p == 1) ? 'money' : 'list',
        'payment_badge': (p == 1) ? 'primary' : 'primary',
        'payment_method_descr': (p == 1) ? 'Cash' : 'Credit card'
      });
    },

    onRender: function() {
      var model = this.model;
      var amount = parseFloat(model.get('amount'));
    }
  });

  return RecordItemView;
});
