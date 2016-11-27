define([
  'marionette',
  'schemas/record-schema',
  'schemas/search-schema',
  'views/recordItemView',
  'views/balanceView',
  'moment',
  'templates'
], function(Marionette, RecordSchema, SearchSchema, RecordItemView, BalanceView, moment, templates) {

  return Marionette.CompositeView.extend({
    template: templates.browseRecords,
    childView: RecordItemView,
    childViewContainer: '.records-items',
    // TODO: use regions - switch to Marionette.View
    // regions: {
    //   recordsRegion: '#records-content'
    //   balanceRegion: '#balance-content'
    // },
    collectionEvents: {
      'sync': '_render'
    },
    events: {
      'click .toggle-search' : 'onToggleSearch',
      'click .navigate': 'onNavigate',
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
    onNavigate: function(e) {
      e.preventDefault();
      var cls = $(e.currentTarget).data('cls');
      if(cls) {
        app.navigate(cls);
      }
      return false;
    },
    onToggleSearch: function(e) {
      e.preventDefault();
      this.ui.searchForm.toggle();
    },
    serializeData: function() {
      var sumExpenses = 0, sumIncomes = 0;
      var expenses = this.collection.get_expenses();
      var incomes = this.collection.get_incomes();

      if(expenses.length) {
        _.each(expenses, function(model) {
          sumExpenses+=model.get('amount')
        }, this);
      }

      if(incomes.length) {
        _.each(incomes, function(model) {
          sumIncomes+=model.get('amount')
        }, this);
      }

      return _.extend(this.collection.toJSON(), {
        stats: {
          expenses: sumExpenses,
          incomes: sumIncomes,
          balance: (sumIncomes - sumExpenses)
        }
      });
    },
    _render: function() {
      this.render();
      componentHandler.upgradeDom();
      this.ui.inputEntryDateFrom.datepicker({
        dateFormat: 'mm-dd-yyyy',
        onSelect: _.bind(function(fd, nd) {
          var d = moment(nd);
          if (d.isValid()) {
            this.$('.mdl-input-entry-date-from').addClass('is-dirty');
          }
          return nd;
        }, this)
      });
      this.ui.inputEntryDateTo.datepicker({
        dateFormat: 'mm-dd-yyyy',
        onSelect: _.bind(function(fd, nd) {
          var d = moment(nd);
          if (d.isValid()) {
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

    onRender: function() {
      // this.balanceView = new BalanceView();
      // this.getRegion('balanceRegion').show(this.balanceView);
    },

    onClearSearch: function(e) {
      e.preventDefault();
      this.collection.fetch();
      this.ui.searchForm.empty();
    },

    onSearch: function(e) {
      if (e) {
        e.preventDefault();
      }
      var data = _.extend({});
      var serializedData = this.ui.searchForm.serializeArray();

      _.each(serializedData, function(d) {
        var datefield = $('#' + d.name);
        if (d.value) {
          data[d.name] = (datefield.length) ? this._fixDate(d.value) : d.value;
        }
      }, this);

      if (!_.isEmpty(data)) {
        $.ajax({
          url: app.baseUrl + '/search/records',
          method: 'POST',
          data: data,
          success: _.bind(function(response) {
            if (response && response.data) {
              this.collection.reset(response.data);
              this._render();
            }
            return false;
          }, this)
        });
      }
      return false;
    }
  });

});
