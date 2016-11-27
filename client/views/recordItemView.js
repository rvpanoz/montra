define([
  'marionette',
  'schemas/category-schema',
  'templates',
  'moment'
],function(Marionette, CategorySchema, templates, moment) {

  var RecordItemView = Marionette.View.extend({
    template: templates.recordItemView,
    tagName: 'tr',
    events: {
      'click .update': 'onEventUpdate'
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

    serializeData: function() {
      var d = this.model.get('entry_date');
      var k = this.model.get('kind');
      var p = this.model.get('payment_method');
      return _.extend(this.model.toJSON(), {
        'entry_date_formatted': moment(new Date(d)).format('MMMM DD YYYY'),
        'kind_descr': (k == 1) ? 'Expense' : 'Income',
        'payment_method_descr': (p == 1) ? 'Cash' : 'Credit card',
        'label_cls_kind': (k == 1) ? 'primary' : 'primary',
        'label_cls_payment_method': (p == 1) ? 'primary' : 'primary'
      });
    }
  });

  return RecordItemView;
});
