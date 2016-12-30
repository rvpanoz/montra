define([
  'marionette',
  'schemas/record-schema',
  'schemas/record-bindings',
  'schemas/category-schema',
  'templates',
  'moment'
], function(Marionette, RecordSchema, RecordBindings, CategorySchema, templates, moment) {

  return Marionette.View.extend({
    template: templates.record,
    className: 'record-form',
    modelEvents: {
      'change': 'onModelChange',
      'sync': '_render'
    },
    childViewEvents: {
      'update:element': 'onUpdateElement'
    },
    events: {
      'click .navigate': 'onNavigate',
      'click .save': 'onEventSave',
      'click .back': 'onEventBack'
    },
    ui: {
      snackbar: '#snackbar',
      divCategory: '.mdl-select',
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

      this.collection.fetch().done(_.bind(this._createCategories, this));

      //fetch model if id
      if (params.id) {
        this.model.set('_id', params.id);
        this.model.fetch();
      }

      //listen to validation errors
      this.listenTo(this.model, 'invalid', this.onValidationError, this);
    },

    _render: function() {
      componentHandler.upgradeElement(this.el);

      var kind = this.model.get('kind').toString();
      switch(kind) {
        case "1":
        this.$('.label-kind-1').addClass('is-checked');
        this.$('.label-kind-2').removeClass('is-checked');
        break;
        case "2":
        this.$('.label-kind-2').addClass('is-checked');
        this.$('.label-kind-1').removeClass('is-checked');
        break;
      }

      var payment_method = this.model.get('payment_method').toString();
      switch(payment_method) {
        case "1":
        this.$('.label-payment-method-1').addClass('is-checked');
        this.$('.label-payment-method-2').removeClass('is-checked');
        break;
        case "2":
        this.$('.label-payment-method-2').addClass('is-checked');
        this.$('.label-payment-method-1').removeClass('is-checked');
        break;
      }

    },

    _createCategories: function(categories) {
      _.each(categories.data, function(category) {
        this.ui.inputCategory_id.append('<option value="' + category._id + '">' + category.name + "</option>");
      }, this);
      var category = this.collection.at(0);
      this.model.set('category_id', category.get('_id'));
    },

    onNavigate: function(e) {
      e.preventDefault();
      var cls = $(e.currentTarget).data('cls');
      if(cls) {
        app.navigate(cls);
      }
      return false;
    },

    onModelChange: function(model) {
      for(var z in model.changed) {
        var element = this.$('.mdl-' + z);
        if(element.length) {
          element.addClass('is-dirty').removeClass('is-invalid');
        }
      }
    },

    onUpdateElement: function(element) {
      componentHandler.upgradeElement(element);
    },

    onRender: function() {
      this.stickit();
      var model = this.model;
      this.ui.inputCategory_id.bind('change', function(e) {
        var target = $(e.currentTarget);
        model.set('category_id', target.val());
      });
    },

    onAttach: function() {
      this.ui.inputEntryDate.datepicker({
        dateFormat: 'dd/mm/yyyy',
        autoClose: true,
        onSelect: _.bind(function(d, fd) {
          this.model.set('entry_date', d);
        }, this)
      });
      if(this.model.isNew()) {
        this.model.set('entry_date', moment().format('DD/MM/YYYY'));
      } else {
        var d = this.model.get('entry_date');
        this.ui.inputEntryDate.val(d);
      }
    },

    onEventSave: function(e) {
      if(e) {
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

      _.each(errors, function(err) {
        var element = this.$('.mdl-' + err.field);
        if(element) {
          element.addClass('is-invalid');
        }
      }, this);

      this.ui.snackbar[0].MaterialSnackbar.showSnackbar({
        message: 'Fill the required fields.'
      });

      return _.isEmpty(errors) ? void 0 : errors;
    },

    onEventBack: function(e) {
      if(e) {
        e.preventDefault();
      }
      return app.navigate('records');
    },

    serializeData: function() {
      return {
        items: {
          isNew: this.model.isNew(),
          title: (this.model.isNew()) ? 'New record' : 'Edit record'
        }
      }
    }
  });

});
