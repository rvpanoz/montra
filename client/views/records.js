define([
  'marionette',
  'schemas/record-schema',
  'schemas/category-schema',
  'views/recordItemView',
  'views/recordsStatsView',
  'moment',
  'templates'
], function(Marionette, RecordSchema, CategorySchema, RecordItemView, RecordsStatsView, moment, templates) {

  return Marionette.CompositeView.extend({
    template: templates.browseRecords,
    childView: RecordItemView,
    page: 1,
    perPage: 12,
    pagination: true,
    className: 'row',
    childViewContainer: '.records-items',
    childViewTriggers: {
      'clone:model': 'child:clone:model'
    },
    collectionEvents: {
      'sync': 'onSync',
      'sort': 'render',
      'remove': 'onRemove'
    },
    events: {
      'click .pagination-number': 'onPaginate',
      'click .pagination-arrow': 'onPaginate',
      'click .filter-bar h4': 'onToggleBlock',
      'click .filter-trigger': 'onToggleFilters',
      'click .filter-close': 'onToggleFilters',
      'click .navigate': 'onNavigate',
      'click button.search': 'onSearch',
      'click button.new': 'onNew',
      'click button.clear': 'onClearSearch'
    },
    ui: {
      filters: '.filter-bar',
      searchForm: '.filter-form',
      inputEntryDateFrom: '#input-entry-date-from',
      inputEntryDateTo: '#input-entry-date-to',
      inputCategory: '#input-category'
    },

    initialize: function() {
      _.bindAll(this, 'onSync');
      this.collection = new RecordSchema.collection();
      this.categories = new CategorySchema.collection();
      this.collection.fetch();
    },

    _createCategories: function(categories) {
      _.each(categories.data, function(category) {
        this.ui.inputCategory.append('<option value="' + category._id + '">' + category.name + "</option>");
      }, this);
      this.ui.inputCategory.val("0");
    },

    _fixFilterBar: function() {
      var filterBar = this.ui.filters;
      filterBar.addClass('filter-is-hidden');
    },

    onSort: function(e) {
      e.preventDefault();
    },

    onChildCloneModel: function(model) {
      return app.navigate('record', {
        model: model
      });
    },

    onRemove: function(model, collection) {
      this.triggerMethod('model:removed', model);
    },

    onNew: function(e) {
      e.preventDefault();
      app.navigate('record');
      return false;
    },

    onToggleBlock: function(e) {
      e.preventDefault();
      $(e.currentTarget).toggleClass('closed').siblings('.filter-bar-content').slideToggle(300);
      return false;
    },

    numPages: function() {
      // return Math.ceil(this.collection.total / this.perPage);
      return this.collection.pages;
    },

    onPaginate: function(e) {
      e.preventDefault();

      var target = this.$(e.currentTarget);
      var page;

      if (target.hasClass('arrow-right')) {
        this.page++;
      } else if (target.hasClass('arrow-left')) {
        this.page--;
      } else if (target.hasClass('pagination-number')) {
        page = parseInt(target.text());
        this.page = page;
      }

      if (this.page < 1) this.page = 1;
      if (this.page > this.numPages()) {
        this.page = this.numPages();
      }

      /**TODO**/
      this.collection.fetch({
        data: {
          page: page
        }
      });

      return false;
    },

    onSync: function() {
      var pagination = this.$('ul.pagination');
      pagination.html('');

      if (this.page > this.numPages()) {
        return;
      }

      var box = this.$('ul.pagination li');
      var first = this.$('ul.pagination li').eq(1);
      var html = "";

      if (this.numPages() > 0) {
        for (var z = 0; z < this.numPages(); z++) {
          var $pageNo = $('<li/>', {
            class: 'pagination-number',
          }).html('<a href="#">' + (z + 1) + '</a>');
          html += $pageNo[0].outerHTML;
        }
        pagination.append(html);
        this.$('ul.pagination').addClass('is-filled');
      }

      box.eq(this.page).addClass('active');

      if (this.page == 1) {
        this.$('.arrow-left').hide();
        this.$('.arrow-right').show();
      } else {
        if (this.page == this.numPages()) {
          this.$('.arrow-right').hide();
          this.$('.arrow-left').show();
        }
      }

      this.triggerMethod('fetch:records', {
        collection: this.collection
      });
    },

    onNavigate: function(e) {
      e.preventDefault();
      var cls = $(e.currentTarget).data('cls');
      app.navigate(cls);
      return false;
    },

    onToggleFilters: function(e) {
      if(e)
        e.preventDefault();
      this.ui.filters.toggleClass('filter-is-visible');
    },

    serializeData: function() {
      var sumExpenses = 0,
        sumIncomes = 0;

      this.collection.each(function(model) {
        var kind = model.get('kind').toString();
        var amount = parseFloat(model.get('amount'));
        if (kind == 1)
          sumExpenses += amount;
        if (kind == 2)
          sumIncomes += amount;
      });

      var balance = sumIncomes - sumExpenses;

      return _.extend(this.collection.toJSON(), {
        stats: {
          total: this.collection.total,
          expenses: sumExpenses.toFixed(2),
          incomes: sumIncomes.toFixed(2),
          balance: balance.toFixed(2)
        }
      });
    },

    setDatepickers: function() {
      for (var z in this.ui) {
        var contains = 'EntryDate';
        if (z.indexOf(contains) > 0) {
          this.ui[z].datepicker({
            dateFormat: 'dd/mm/yyyy',
            autoClose: true
          });
        }
      }

      //set default values
      var dateFrom = moment().startOf('month').format('DD/MM/YYYY');
      var dateTo = moment().endOf('month').format('DD/MM/YYYY');

      this.ui.inputEntryDateFrom.val(dateFrom);
      this.ui.inputEntryDateTo.val(dateTo);
    },

    onRender: function() {
      this._fixFilterBar();
      this.setDatepickers();
      this.categories.fetch().done(_.bind(function(response) {
        this._createCategories(response);
        this.$('.selectpicker').selectpicker();
      }, this));
    },

    onAttach: function() {},

    onClearSearch: function(e) {
      if(e)
        e.preventDefault();
      this.collection.fetch({
        data: {
          page: 1
        },
        success: _.bind(function() {
          this.onToggleFilters();
        }, this)
      });
    },

    getData: function() {
      var data = _.extend({});
      var serializedData = this.ui.searchForm.serializeArray();

      _.extend(data, {
        page: (this.page <= 0) ? 1 : this.page
      });

      _.each(serializedData, function(d) {
        var datefield = $('#' + d.name);
        var isDateInput = (d.name.indexOf('date') > 0) ? true : false;
        if (d.value && isDateInput) {
          data[d.name] = app.stringToDate(d.value, 'dd/mm/yyyy', '/');
        } else {
          data[d.name] = d.value;
        }
      }, this);

      return data;
    },

    onSearch: function(e) {
      if (e) {
        e.preventDefault();
      }

      this.searchData = this.getData();
      this.collection.fetch({
        data: this.searchData,
        success: _.bind(function(response) {
          this.render();
        }, this)
      });

      return false;
    }
  });

});
