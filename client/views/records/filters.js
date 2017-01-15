define([
  'marionette',
  'templates',
  'schemas/record-schema',
  'schemas/category-schema',
  'moment',
  'bootstrap-select'
], function(Marionette, templates, RecordSchema, CategorySchema, moment) {

  var FiltersView = Marionette.View.extend({
    template: templates.filtersView,
    ui: {
      dateTo: '.input-entry-date-to',
      dateFrom: '.input-entry-date-from',
      category: '.input-category',
      kind: '.input-kind',
      payment: '.input-payment',
      filters: '.datalist-filter'
    },
    modelEvents: {
      'change': 'onModelChange'
    },

    initialize: function() {
      this.categories = new CategorySchema.collection();
      this.model = new RecordSchema.model();
    },

    onModelChange: function(model) {
      this._doSearch();
    },

    _createCategories: function(categories) {
      _.each(categories.data, function(category) {
        this.ui.category.append('<option value="' + category._id + '">' + category.name + "</option>");
      }, this);
      this.ui.category.val();
    },

    setDatepickers: function() {
      for (var z in this.ui) {
        if (z.indexOf('date') > -1) {
          this.ui[z].datepicker({
            dateFormat: 'dd/mm/yyyy',
            autoClose: true,
            onSelect: _.bind(function(formatted, value) {
              this._doSearch();
            }, this)
          });
        }
      }

      //set default values
      var dateFrom = moment().startOf('month').format('DD/MM/YYYY');
      var dateTo = moment().endOf('month').format('DD/MM/YYYY');
      this.ui.dateTo.val(dateTo);
      this.ui.dateFrom.val(dateFrom);
    },

    onRender: function() {
      //datepickers
      this.setDatepickers();

      //categories
      this.categories.fetch().done(_.bind(function(response) {
        this._createCategories(response);
        this.ui.category.selectpicker();
        this.ui.category.bind('hidden.bs.select', _.bind(function (e) {
          var category_id = this.ui.category.selectpicker('val');
          this.model.set('category_id', category_id);
        }, this));
      }, this));

      //kind
      this.ui.kind.selectpicker();
      this.ui.kind.bind('hidden.bs.select', _.bind(function (e) {
        var category_id = this.ui.kind.selectpicker('val');
        this.model.set('kind', category_id);
      }, this));

      //payment-method
      this.ui.payment.bind('change', _.bind(function(e) {
        var method = parseInt($(e.currentTarget).val());
        this.model.set('payment-method', method);
      }, this));
    },

    getData: function() {
      var data = _.extend({});
      var serializedData = this.getUI('filters').serializeArray();

      _.extend(data, {
        page: (this.page <= 0) ? 1 : this.page
      });

      _.each(serializedData, function(d) {
        var datefield = $('#' + d.name);
        var isDateInput = (d.name.indexOf('date') > 0) ? true : false;
        if (isDateInput) {
          data[d.name] = app.stringToDate(d.value, 'dd/mm/yyyy', '/');
        } else {
          data[d.name] = d.value;
        }
      }, this);

      return data;
    },

    _doSearch: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.data = this.getData();
      this.triggerMethod("apply:filters", this.data);
      return false;
    }
  });

  return FiltersView;
});
