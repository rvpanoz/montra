define([
  'marionette',
  './paginationItemView',
  'templates'
], function(Marionette, PaginationItemView, templates) {

  var PaginationView = Marionette.CompositeView.extend({
    template: templates.pagination,
    className: 'dataTables_paginate paging_numbers',
    childView: PaginationItemView,
    childViewContainer: '.pagination-items',
    page: 1,
    pages: 0,
    total: 0,
    initialize: function(opts) {
      this.pages = opts.collection.pages;
      this.page = 1;
      this.total = opts.collection.total;

      this.collection = new Backbone.Collection();
      for(var p=0;p<this.pages;p++) {
        var model = new Backbone.Model({
          page: p
        });
        var page = parseInt(model.get('page'));
        model.set('page', page+=1);
        this.collection.add(model);
      }
    }
  });

  return PaginationView;
});
