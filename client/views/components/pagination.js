define([
  'marionette',
  'views/components/paginationItemView',
  'templates'
], function(Marionette, PaginationItemView, templates) {

  var PaginationView = Marionette.CompositeView.extend({
    template: templates.pagination,
    childView: PaginationItemView,
    childViewContainer: '.pagination-items',
    tagName: 'nav',
    collectionEvents: {
      'add': 'render'
    },
    initialize: function(params) {
      this.pages = params.pages;
      this.collection = new Backbone.Collection();
      for(var z=0;z<this.pages.length;z++) {
        var model = new Backbone.Model({
          number: z
        });
        this.collection.add(model);
      }
    },
    onAttach: function() {

    },
    onRender: function() {

    }
  });

  return PaginationView;
});
