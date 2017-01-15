define([
  'marionette',
  'schemas/record-schema',
  'schemas/record-bindings',
  'schemas/category-schema',
  'templates',
  'moment',
  'bootstrap-select',
  'datepicker'
], function(Marionette, RecordSchema, RecordBindings, CategorySchema, templates, moment) {

  return Marionette.View.extend({
    template: templates.record,
    className: 'record-form',
    modelEvents: {
      'invalid': 'onValidationError',
      'change': 'onModelChange',
      'sync': 'render'
    },
    events: {
      'click .save': 'onSave',
      'click .cancel': 'onBack'
    },
    ui: {
      inputKind: '#input-kind',
      inputCategory: '#input-category',
      inputEntryDate: '#input-entry-date'
    },

    initialize: function(params) {
      this.model = new RecordSchema.model();
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
      console.log('model changed', model);
    },

    onRender: function() {
      var model = this.model;

      //stickit
      this.stickit();

      //categories build
      this.ui.inputCategory.append('<option value="0"');
      _.each(this.categories, function(category) {
        this.ui.inputCategory.append('<option value="' + category._id + '">' + category.name + "</option>");
      }, this);

      //selectpicker category
      this.ui.inputCategory.selectpicker();
      this.ui.inputCategory.bind('hidden.bs.select', _.bind(function (e) {
        var category_id = this.ui.inputCategory.selectpicker('val');
        this.model.set('category_id', category_id);
      }, this));

      //selectpicker kind
      this.ui.inputKind.selectpicker();
      this.ui.inputKind.bind('hidden.bs.select', _.bind(function (e) {
        var kind = this.ui.inputKind.selectpicker('val');
        this.model.set('kind', kind);
      }, this));

      //datepicker date
      this.ui.inputEntryDate.datepicker({
        dateFormat: 'dd/mm/yyyy',
        autoClose: true,
        onSelect: _.bind(function(d, fd) {
          this.model.set('entry_date', d);
        }, this)
      });

      if (this.model.isNew()) {
        this.model.set('entry_date', moment().format('DD/MM/YYYY'));
      } else {
        var d = this.model.get('entry_date');
        this.ui.inputEntryDate.val(d);
      }
    },

    onSave: function(e) {
      if (e) {
        e.preventDefault();
      }

      this.model.save(null, {
        success: _.bind(this.onEventSaveCallback, this)
      });
    },

    onEventSaveCallback: function(model) {
      return this.onBack();
    },

    onValidationError: function(model) {
      var errors = model.validationError;
      var groups = this.$('.form-group');

      //remove has-error
      groups.removeClass('has-error');

      _.each(errors, function(err) {
        var element = this.$('.form-group-' + err.field);
        if (element) {
          element.addClass('has-error');
        }
      }, this);

      return _.isEmpty(errors) ? void 0 : errors;
    },

    onBack: function(e) {
      if (e) {
        e.preventDefault();
      }
      return app.navigate('records/records');
    },

    serializeData: function() {
      return {
        title: (this.model.isNew()) ? 'New record' : 'Edit record'
      }
    }
  });

});
