define([
  'marionette',
  'schemas/record-schema',
  'schemas/search-schema',
  'views/recordItemView',
  'moment',
  'templates'
], function(Marionette, RecordSchema, SearchSchema, RecordItemView, moment, templates) {

  return Marionette.CompositeView.extend({
    template: templates.browseRecords,
    childView: RecordItemView,
    childViewContainer: '.records-items',
    collectionEvents: {
      'sync': '_render'
    },
    events: {
      'click .search': 'onSearch',
      'click .clear': 'onClearSearch'
    },
    ui: {
      searchForm: '.search-form',
      inputEntryDateFrom: '#input-entry-date-from',
      inputEntryDateTo: '#input-entry-date-to'
    },
    initialize: function() {
      _.bindAll(this, '_render');
      this.collection = new RecordSchema.collection();
      this.collection.fetch();
    },
    serializedData: function() {
      return _.extend(this.collection.toJSON());
    },
    onAttach: function() {

    },
    _render: function() {
      this.render();
      componentHandler.upgradeDom();
      this.ui.inputEntryDateFrom.datepicker({
        dateFormat: 'mm-dd-yyyy',
        onSelect: _.bind(function(fd, nd) {
          var d = moment(nd);
          if(d.isValid()) {
            this.$('.mdl-input-entry-date-from').addClass('is-dirty');
          }
          return nd;
        }, this)
      });
      this.ui.inputEntryDateTo.datepicker({
        dateFormat: 'mm-dd-yyyy',
        onSelect: _.bind(function(fd, nd) {
          var d = moment(nd);
          if(d.isValid()) {
            this.$('.mdl-input-entry-date-to').addClass('is-dirty');
          }
          return nd;
        }, this)
      });
    },

    _fixDate: function(value) {
      var d = value.split('-');
      return moment(new Date(d[0] + '-' + d[1] + '-' + d[2])).toISOString();
    },

    onClearSearch: function(e) {
      e.preventDefault();
      this.collection.fetch();
      this.ui.searchForm.empty();
    },

    onSearch: function(e) {
      if(e) {
        e.preventDefault();
      }
      var data = _.extend({});
      var serializedData = this.ui.searchForm.serializeArray();

      _.each(serializedData, function(d) {
        var datefield = $('#' + d.name);
        if(d.value) {
          data[d.name] = (datefield.length) ? this._fixDate(d.value) : d.value;
        }
      }, this);

      if(!_.isEmpty(data)) {
        $.ajax({
          url: app.baseUrl + '/search/records',
          method: 'POST',
          data: data,
          success: _.bind(function(response) {
            if(response && response.data) {
              this.collection.reset(response.data);
            }
            return false;
          }, this)
        });
      }
      return false;
    }
  });

});
