define([
  'marionette',
  'schemas/record-schema',
  'schemas/search-schema',
  'schemas/category-schema',
  'views/recordItemView',
  'moment',
  'templates'
], function(Marionette, RecordSchema, SearchSchema, CategorySchema, RecordItemView, moment, templates) {

  return Marionette.CompositeView.extend({
    page: 1,
    perPage: 12,
    pagination: true,
    className: 'mui-container-fluid',
    template: templates.browseRecords,
    childView: RecordItemView,
    pagination: true,
    childViewContainer: '.records-items',
    collectionEvents: {
      'sync': 'onSync',
      'sort': 'render'
    },
    events: {
      'click .pagination-number': 'onPaginate',
      'click .pagination-arrow': 'onPaginate',
      'click .mntr-filter h4': 'onToggleBlock',
      'click .mntr-filter-trigger': 'onToggleFilters',
      'click .mntr-close': 'onToggleFilters',
      'click .navigate': 'onNavigate',
      'click button.filter': 'onSearch',
      'click .clear': 'onClearSearch',
      'click .sort': 'onSort'
    },
    ui: {
      dataTable: '.mdl-data-table',
      filters: '.mntr-filter',
      searchForm: '.mntr-filter-form',
      inputEntryDateFrom: '#input-entry-date-from',
      inputEntryDateTo: '#input-entry-date-to',
      divCategory: '.mdl-select',
      inputCategory_id: '#input-category',
      next: 'button.next',
      prev: 'button.prev'
    },

    initialize: function() {
      this.collection = new RecordSchema.collection();
      this.categories = new CategorySchema.collection();
      this.collection.fetch();
    },

    _createCategories: function(categories) {
      _.each(categories.data, function(category) {
        this.ui.inputCategory_id.append('<option value="' + category._id + '">' + category.name + "</option>");
      }, this);
    },

    onToggleBlock: function(e) {
      e.preventDefault();
      $(e.currentTarget).toggleClass('closed').siblings('.mntr-filter-content').slideToggle(300);
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

      this.collection.fetch({
        data: {
          page: (this.page <= 0) ? 1 : this.page
        }
      });

      return false;
    },

    onSync: function() {
      if (this.$('ul.component-pagination').hasClass('is-filled')) {
        return;
      }

      var $current = this.$('li.pagination-number');
      var box = this.$('ul.component-pagination li');
      var html = "";


      if (this.numPages() > 0) {
        for (var z = 2; z < this.numPages() + 1; z++) {
          var $pageNo = $('<li/>', {
            class: 'pagination-number',
            text: z
          });
          html += $pageNo[0].outerHTML;
        }
        $current.after(html);
        this.$('ul.component-pagination li').eq(1).addClass('current-number');
        this.$('ul.component-pagination').addClass('is-filled');
      }

      var box = this.$('ul.component-pagination li');
      box.each(function(idx, li) {
        $(li).removeClass('current-number');
      });

      box.eq(this.page).addClass('current-number');

      if (this.page == 1) {
        this.$('.arrow-left').hide();
        this.$('.arrow-right').show();
      } else {
        if (this.page == this.numPages()) {
          this.$('.arrow-right').hide();
          this.$('.arrow-left').show();
        }
      }
    },

    onSort: function(e) {
      e.preventDefault();
      var $dataTable = this.$('.mdl-data-table');
      var $element = this.$(e.currentTarget);

      this.collection.sortField = $element.data('field');
      this.collection.sortDir = $element.hasClass('mdl-data-table__header--sorted-descending') ? -1 : 1;

      //sort collection
      this.collection.sort();

      if (this.collection.sortDir == 1) {
        $element.addClass('mdl-data-table__header--sorted-descending');
        $element.removeClass('mdl-data-table__header--sorted-ascending');
        this.collection.sortDir = -1;
      } else {
        if (this.collection.sortDir == -1) {
          $element.addClass('mdl-data-table__header--sorted-ascending');
          $element.removeClass('mdl-data-table__header--sorted-descending');
          this.collection.sortDir = 1;
        }
      }

      //mark element
      $element.addClass('sorted');
    },

    onNavigate: function(e) {
      e.preventDefault();
      var cls = $(e.currentTarget).data('cls');
      app.navigate(cls);
      return false;
    },

    onToggleFilters: function(e) {
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
          totals: this.collection.total,
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
            autoClose: true,
            onSelect: _.bind(function(d, fd) {
              if (z.indexOf('Datefrom') > 0) {
                this.$('.mdl-entry_date-from').addClass('is-dirty');
              }
              if (z.indexOf('DateTo') > 0) {
                this.$('.mdl-entry_date-to').addClass('is-dirty');
              }
            }, this)
          });
        }
      }

      //set default values
      var dateFrom = moment().startOf('month').format('DD/MM/YYYY');
      var dateTo = moment().endOf('month').format('DD/MM/YYYY');

      this.ui.inputEntryDateFrom.val(dateFrom);
      this.$('.mdl-entry_date-from').addClass('is-dirty');
      this.ui.inputEntryDateTo.val(dateTo);
      this.$('.mdl-entry_date-to').addClass('is-dirty');
    },

    onRender: function() {
      componentHandler.upgradeDom();
      this.setDatepickers();

      this.categories.fetch().done(_.bind(function(response) {
        this._createCategories(response);
        this.ui.divCategory.addClass('is-dirty');
      }, this));

      var target = this.$('.records-table-container h3');
      var table = this.$('.mdl-data-table');
      var top = target.offset().top;
      var left = table.offset().left;

      this.$('.mntr-filter-trigger').css({
        top: top - 10,
        left: left + (table.width() - 50)
      });
    },

    onAttach: function() {},

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
        var isDateInput = (d.name.indexOf('date') > 0) ? true : false;
        if (d.value && isDateInput) {
          data[d.name] = app.stringToDate(d.value, 'dd/mm/yyyy', '/');
        } else {
          data[d.name] = d.value;
        }
      }, this);

      if (!_.isEmpty(data)) {
        $.ajax({
          url: app.baseUrl + '/search/records',
          method: 'POST',
          data: data,
          success: _.bind(function(response) {
            this.collection.reset(response.data);
            this.render();
            this.onSync();
          }, this)
        });
      }

      return false;
    }
  });

});
