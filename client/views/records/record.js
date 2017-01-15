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
      'sync': 'render'
    },
    events: {
      'click .save': 'onSave',
      'click .cancel': 'onBack'
    },
    ui: {
      kind: '#input-kind',
      category: '#input-category',
      entryDate: '#input-entry-date'
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

    onRender: function() {
      var model = this.model;

      //categories build
      this.ui.category.append('<option value="0"');
      _.each(this.categories, function(category) {
        this.ui.category.append('<option value="' + category._id + '">' + category.name + "</option>");
      }, this);

      //selectpicker category
      this.ui.category.selectpicker();
      this.ui.category.selectpicker('val', this.model.get('category_id'));
      this.ui.category.bind('hidden.bs.select', _.bind(function (e) {
        var category_id = this.ui.category.selectpicker('val');
        this.model.set('category_id', category_id);
      }, this));

      //selectpicker kind
      this.ui.kind.selectpicker();
      this.ui.kind.selectpicker('val', this.model.get('kind'));
      this.ui.kind.bind('hidden.bs.select', _.bind(function (e) {
        var kind = this.ui.kind.selectpicker('val');
        this.model.set('kind', kind);
      }, this));

      //datepicker date
      this.ui.entryDate.datepicker({
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
        this.ui.entryDate.val(d);
      }

      //stickit
      this.stickit();
    },

    onSave: function(e) {
      e.preventDefault();
      this.model.save(null, {
        success: _.bind(this.onBack, this)
      });
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
      return app.navigate('records/records');
    },

    serializeData: function() {
      return {
        title: (this.model.isNew()) ? 'New record' : 'Edit record'
      }
    }
  });

});
