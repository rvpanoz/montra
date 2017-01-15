define([
  'marionette',
  './paginationItemView',
  'templates'
], function(Marionette, PaginationItemView, templates) {

  var PaginationView = Marionette.CompositeView.extend({
    template: templates.pagination,
    childView: PaginationItemView,
    childViewContainer: '.pagination-items',
    page: 1,
    pages: 0,
    total: 0,
    childViewTriggers: {
      'paginate': 'child:paginate'
    },

    initialize: function(opts) {
      this.pages = opts.collection.pages;
      this.page = opts.collection.page;
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
    },

    getPage: function() {
      return this.page;
    },

    onChildPaginate: function(opts) {
      this.page = parseInt(opts.page) || 1;
      if (this.page < 1) this.page = 1;
      if (this.page > this.total) {
        this.page = this.pages;
      }
      return true;
    }
  });

  return PaginationView;
});
