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
    className: 'mdl-grid',
    childViewContainer: '.records-items',
    collectionEvents: {
      'sort': 'render'
    },
    events: {
      'click .toggle-search' : 'onToggleSearch',
      'click .navigate': 'onNavigate',
      'click .search': 'onSearch',
      'click .clear': 'onClearSearch',
      'click .sort': 'onSort'
    },
    ui: {
      searchForm: '.search-form',
      inputEntryDateFrom: '#input-entry-date-from',
      inputEntryDateTo: '#input-entry-date-to'
    },
    initialize: function() {
      this.collection = new RecordSchema.collection();
      this.collection.fetch();
    },
    onSort: function(e) {
      e.preventDefault();
      var dataTable = this.$('.mdl-data-table');
      var element = this.$(e.currentTarget);
      this.collection.sortField = element.data('field');
      this.collection.sortDir = element.hasClass('mdl-data-table__header--sorted-descending') ? -1 : 1;

      //sort collection
      this.collection.sort();

      //update UI
      if(this.collection.sortDir == 1) {
        element.addClass('mdl-data-table__header--sorted-descending');
        element.removeClass('mdl-data-table__header--sorted-ascending');
        this.collection.sortDir = -1;
      } else {
        if(this.collection.sortDir == -1) {
          element.addClass('mdl-data-table__header--sorted-ascending');
          element.removeClass('mdl-data-table__header--sorted-descending');
          this.collection.sortDir = 1;
        }
      }
    },

    onNavigate: function(e) {
      e.preventDefault();
      var cls = $(e.currentTarget).data('cls');
      app.navigate(cls);
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

    _fixDate: function(value) {
      var d = value.split('-');
      return moment(new Date(d[0] + '-' + d[1] + '-' + d[2])).toISOString();
    },

    onRender: function() {
      debugger;
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
