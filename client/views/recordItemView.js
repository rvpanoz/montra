define([
  'marionette',
  'schemas/record-schema',
  'schemas/category-schema',
  'templates',
  'moment'
], function(Marionette, RecordSchema, CategorySchema, templates, moment) {

  var RecordItemView = Marionette.View.extend({
    template: templates.recordItemView,
    className: 'record-item',
    tagName: 'li',
    modelEvents: {
      'destroy': 'onModelDestroy'
    },
    events: {
      'click .check-action': 'onSelect',
      'click .update': 'onEventUpdate',
      'click .remove': 'onEventRemove',
      'click .clone': 'onEventClone'
    },
    ui: {
      'buttonUpdate': '.update',
      'buttonRemove': '.remove',
      'buttonClone': '.clone'
    },

    onModelDestroy: function(model) {
      this.triggerMethod('remove:model', model);
    },

    onEventUpdate: function(e) {
      e.preventDefault();
      app.navigate('record', {
        id: this.model.get('_id')
      });
      return false;
    },

    onSelect: function(e) {
      var $target = $(e.target);
      var selected = $target.is(':checked');
      if(selected == true) {
        $target.closest('li').addClass('selected')
      } else if(selected == false) {
        $target.closest('li').removeClass('selected')
      }
      this.model.set('_selected', selected);
      return true;
    },

    onEventClone: function(e) {
      e.preventDefault();
      var attrs = _.pick(this.model.attributes,
        'amount',
        'entry_date',
        'kind',
        'payment_method');

      var model = new RecordSchema.model(attrs);
      model.set('category_id', this.model.get('category_id')._id);
      this.triggerMethod('clone:model', model);
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
        'payment_check': (p == 1) ? 'euro' : 'credit-card',
        'payment_badge': (p == 1) ? 'primary' : 'primary',
        'payment_method_descr': (p == 1) ? 'Cash' : 'Credit card'
      });
    }

  });

  return RecordItemView;
});
