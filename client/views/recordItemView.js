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
        'kind_color': (k == 1) ? 'secondary' : 'mint',
        'payment_method_color': (p == 1) ? 'mint' : 'primary',
        'payment_method_descr': (p == 1) ? 'Cash' : 'Credit card',
        'label_cls_kind': (k == 1) ? 'primary' : 'primary',
        'label_cls_payment_method': (p == 1) ? 'primary' : 'primary'
      });
    },

    onRender: function() {
      var model = this.model;
      var amount = parseFloat(model.get('amount'));

      if(amount >= 250 && amount <= 500) {
        this.$el.addClass('value-250-500');
      }

      if(amount >= 500 && amount <= 750) {
        this.$el.addClass('value-500-750');
      }

      if(amount >= 750 && amount <= 10000) {
        this.$el.addClass('value-750-1000');
      }
    }
  });

  return RecordItemView;
});
