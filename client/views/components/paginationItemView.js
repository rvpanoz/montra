define([
  'marionette',
  'templates',
], function(Marionette, templates) {

  var PaginationItemView = Marionette.View.extend({
    template: templates.paginationItemView,
    className: 'pagination-number',
    tagName: 'li',
    events: {
      'click': 'onClick'
    },

    initialize: function() {
      debugger;
    },

    onClick: function(e) {
      e.preventDefault();
    }
  });

  return PaginationItemView;
});
