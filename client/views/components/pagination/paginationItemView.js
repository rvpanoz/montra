define([
  'marionette',
  'templates',
], function(Marionette, templates) {

  var PaginationItemView = Marionette.View.extend({
    template: templates.paginationItemView,
    className: 'paginate_button pagination-number',
    tagName: 'li',
    events: {
      'click': 'onClick'
    },
    onClick: function(e) {
      e.preventDefault();
      this.triggerMethod('paginate', {
        page: this.$el.text()
      });
      return false;
    }
  });

  return PaginationItemView;
});
