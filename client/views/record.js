define([
  'marionette',
  'schemas/record-schema',
  'schemas/record-bindings',
  'schemas/category-schema',
  'templates',
  'moment',
  'bootstrap-select',
  'bootstrap-datepicker'
], function(Marionette, RecordSchema, RecordBindings, CategorySchema, templates, moment) {

  return Marionette.View.extend({
    template: templates.record,
    className: 'record-form',
    modelEvents: {
      'invalid': 'onValidationError',
      'change': 'onModelChange',
      'sync': 'render'
    },
    childViewEvents: {

    },
    events: {
      'click .navigate': 'onNavigate',
      'click .save': 'onEventSave',
      'click .back': 'onEventBack'
    },
    ui: {
      danger: '.alert-danger',
      inputCategory_id: '#input-category',
      inputEntryDate: '#input-entry-date'
    },

    initialize: function(params) {
      //initialize a new record model;
      this.model = new RecordSchema.model();

      //categories
      this.collection = new CategorySchema.collection();

      //setup bindings
      this.bindings = RecordBindings.call(this);

      if(params && params.model) {
        this.model.set(params.model);
      }

      //fetch model if id
      if (params.id) {
        this.model.set('_id', params.id);
        this.model.fetch({
          success: _.bind(function() {
            this.collection.fetch().done(_.bind(this._createCategories, this));
          }, this)
        });
      } else {
        this.collection.fetch().done(_.bind(this._createCategories, this));
      }

      //listen to validation errors
      this.listenTo(this.model, 'invalid', this.onValidationError, this);
    },

    _createCategories: function(categories) {
      this.categories = categories.data;
      this.render();
    },

    onModelChange: function(model) {

    },

    onNavigate: function(e) {
      e.preventDefault();
      var cls = $(e.currentTarget).data('cls');
      if (cls) {
        app.navigate(cls);
      }
      return false;
    },

    onAttach: function() {
      this.$('.selectpicker').selectpicker();
		  this.$('.input-entry-date').datepicker();
    },

    onRender: function() {
      console.log('onRender');
      var model = this.model;

      this.ui.inputCategory_id.append('<option value="0"');
      _.each(this.categories, function(category) {
        this.ui.inputCategory_id.append('<option value="' + category._id + '">' + category.name + "</option>");
      }, this);

      // this.ui.inputEntryDate.datepicker({
      //   dateFormat: 'dd/mm/yyyy',
      //   autoClose: true,
      //   onSelect: _.bind(function(d, fd) {
      //     this.model.set('entry_date', d);
      //   }, this)
      // });

      if (this.model.isNew()) {
        this.model.set('entry_date', moment().format('DD/MM/YYYY'));
      } else {
        var d = this.model.get('entry_date');
        this.ui.inputEntryDate.val(d);
      }

      this.$('[name="input-kind"]').bind('change', function(e) {
        var input_kind = $(e.currentTarget);
        var value = input_kind.val();
        model.set('kind', value);
      });

      this.$('[name="input-payment"]').bind('change', function(e) {
        var input_payment = $(e.currentTarget);
        var value = input_payment.val();
        model.set('payment_method', value);
      });

      this.$('[name="input-category"]').bind('change', function(e) {
        var category_id = $(e.currentTarget);
        var value = category_id.val();
        model.set('category_id', value);
      });

      // this.$('.selectpicker').selectpicker();
      // $('.selectpicker').selectpicker('val', this.model.get('category_id'));

      this.stickit();
    },

    onEventSave: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.model.save(null, {
        success: _.bind(this.onEventSaveCallback, this)
      });
    },

    onEventSaveCallback: function(model) {
      return this.onEventBack();
    },

    onValidationError: function(model) {
      var errors = model.validationError;
      var groups = this.$('.form-group');

      groups.removeClass('has-error');
      _.each(errors, function(err) {
        var element = this.$('.form-group-' + err.field);
        if (element) {
          element.addClass('has-error');
        }
      }, this);

      this.ui.danger.removeClass('hide');
      this.ui.danger.find('span.message').text('Your input is not valid.');

      return _.isEmpty(errors) ? void 0 : errors;
    },

    onEventBack: function(e) {
      if (e) {
        e.preventDefault();
      }
      return app.navigate('records');
    },

    serializeData: function() {
      return {
        title: (this.model.isNew()) ? 'New record' : 'Edit record'
      }
    }
  });

});
