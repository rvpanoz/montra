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
      var page = parseInt(this.$el.text());
      this.triggerMethod('paginate', page);
    }
  });

  return PaginationItemView;
});
