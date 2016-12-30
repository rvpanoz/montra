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
    _searched: false,
    page: 1,
    template: templates.browseRecords,
    childView: RecordItemView,
    childViewContainer: '.records-items',
    collectionEvents: {
      // 'sync': 'onSync',
      'sort': 'render'
    },
    events: {
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
      this.collection.fetch({
        data: {
          page: this.page
        }
      });

      this.listenTo(this.collection, 'change', _.bind(function() {
        this.render();
      }, this));
    },

    _stringToDate(_date, _format, _delimiter) {
      var formatLowerCase = _format.toLowerCase();
      var formatItems = formatLowerCase.split(_delimiter);
      var dateItems = _date.split(_delimiter);
      var monthIndex = formatItems.indexOf("mm");
      var dayIndex = formatItems.indexOf("dd");
      var yearIndex = formatItems.indexOf("yyyy");
      var month = parseInt(dateItems[monthIndex]);
      month -= 1;

      return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
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
      return Math.ceil(this.collection.total / 10);
    },

    onPaginate: function(e) {
      e.preventDefault();
      var target = this.$(e.currentTarget);
      var page = this.page;

      if (target.hasClass('arrow-right')) {
        this.page++;
      } else if (target.hasClass('arrow-left')) {
        this.page--;
      }

      if (this.page < 1) this.page = 1;
      if (this.page > this.numPages()) {
        this.page = this.numPages();
      }

      this.collection.fetch({
        data: {
          page: (this.page <= 0) ? 1 : this.page
        },
        success: _.bind(function() {
          var box = this.$('ul.component-pagination li');
          box.each(function(idx, li) {
            $(li).removeClass('current-number');
          })
          box.eq(this.page).addClass('current-number');
        }, this)
      });

      return false;
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
          totals: this.collection.length,
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

      // if (this.page >= this.numPages()) {
      //   this.$('.arrow-right').hide();
      // } else {
      //   this.$('.arrow-right').show();
      // }
      // if (this.page == 1) {
      //   this.$('.arrow-left').hide();
      // } else {
      //   this.$('.arrow-left').show();
      // }

      if(this.$('ul.component-pagination').hasClass('is-filled')) {
        return;
      }

      var $current = this.$('li.arrow-left');
      var box = this.$('ul.component-pagination li');
      var html = "";
      if(this.numPages() > 0) {
        for(var z=0;z<this.numPages();z++) {
          var $pageNo = $('<li/>', {
            class: 'pagination-number',
            text: z+1
          });
          html+=$pageNo[0].outerHTML;
        }
        $current.after(html);
        this.$('ul.component-pagination li').eq(1).addClass('current-number');
        this.$('ul.component-pagination').addClass('is-filled');
      }

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
          data[d.name] = this._stringToDate(d.value, 'dd/mm/yyyy', '/');
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
          }, this)
        });
      }

      return false;
    }
  });

});
