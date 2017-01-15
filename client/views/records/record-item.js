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
    tagName: 'tr',
    attributes: {
      role: 'row'
    },
    modelEvents: {
      'destroy': 'onModelDestroy'
    },
    events: {
      'click': 'onClick',
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

    initialize: function() {
      this.listenTo(this.model, 'change:_selected', _.bind(function(model, selected) {
        if(selected == true) {
          this.$el.addClass('selected');
        } else if(selected == false) {
          this.$el.removeClass('selected');
        }
      }, this));
    },

    onClick: function(e) {
      e.preventDefault();
      var isSelected = this.$el.toggleClass('selected');
      this.model.set('_selected', this.$el.hasClass('selected'));
      this.triggerMethod('model:selected', this.model);
    },

    onModelDestroy: function(model) {
      this.triggerMethod('remove:model', model);
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
