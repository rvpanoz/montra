define([
  'marionette',
  'schemas/record-schema',
  'schemas/search-schema',
  'views/recordItemView',
  'templates'
], function(Marionette, RecordSchema, SearchSchema, RecordItemView, templates) {

  return Marionette.CompositeView.extend({
    template: templates.browseRecords,
    className: 'container',
    childView: RecordItemView,
    childViewContainer: '.records-items',
    collectionEvents: {
      'sync': '_render'
    },
    events: {
      'click .navigate': 'onNavigate',
      'click .btn-show-search': 'onShowSearch',
      'click .btn-search': 'onSearch'
    },
    ui: {
      'search': '.search-modal',
      'searchForm': '.form-search'
    },
    initialize: function() {
      _.bindAll(this, '_render');
      this.collection = new RecordSchema.collection();
      this.collection.fetch();
    },
    onNavigate: function(e) {
      e.preventDefault();
      var cls = this.$(e.currentTarget).data('cls');
      return app.navigate(cls);
    },
    serializedData: function() {
      return _.extend(this.collection.toJSON());
    },
    _render: function() {
      this.render();
    },
    onShowSearch: function(e) {
      if(e) {
        e.preventDefault();
      }
      this.ui.search.modal('show');
      return false;
    },
    onSearch: function(e) {
      if(e) {
        e.preventDefault();
      }
      var data = _.extend({});
      var serializedData = this.ui.searchForm.serializeArray();
      if(serializedData.length) {
        _.each(serializedData, function(d) {
          if(d.value) {
            data[d.name] = d.value;
          }
        }, this);
      }
      if((_.isNull(data) || _.isEmpty(data))) {
        this.ui.search.modal('hide');
        return false;
      }
      $.ajax({
        url: app.baseUrl + '/search/records',
        method: 'POST',
        data: data,
        success: _.bind(function(response) {
          if(response && response.data) {
            this.collection.reset(response.data);
          }
          this.ui.search.modal('hide');
          return false;
        }, this)
      });
    }
  });

});
