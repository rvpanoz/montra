define([
  'marionette',
  'schemas/record-schema',
  'schemas/record-bindings',
  'views/microviews/categories-select',
  'templates',
  'moment'
], function(Marionette, RecordSchema, RecordBindings, CategorySelectView, templates, moment) {

  return Marionette.View.extend({
    template: templates.record,
    className: 'container',
    regions: {
      categories: '.categories-select'
    },
    modelEvents: {
      'sync': 'onEventSync'
    },
    events: {
      'click #btn-delete': 'onEventDelete',
      'click #btn-ok': 'onEventDeleteAction',
      'click .btn-save': 'onEventSave',
      'click #btn-back': 'onEventBack'
    },
    ui: {
      actions: 'div.form-actions',
      amount: 'div.input-amount',
      category_id: 'div.input-category',
      entry_date: 'div.input-entry-date',
      inputEntryDate: '#input-entry-date',
      modal: '.modal'
    },

    initialize: function(params) {
      //initialize a new record model;
      this.model = new RecordSchema.model();

      //setup bindings
      this.bindings = RecordBindings.call(this);

      //fetch model if id
      if (params.id) {
        this.model.set('_id', params.id);
        this.model.fetch();
      }

      //listen to validation errors
      this.listenTo(this.model, 'invalid', this.onValidationError, this);
    },

    onRender: function() {
      //render categories-select micro view
      this.showChildView('categories', new CategorySelectView());

      //init binding
      this.stickit();
    },

    onAttach: function() {
      //setup datepicker when view is attached to DOM
      this.ui.inputEntryDate.datepicker({
        onSelect: _.bind(function(fd, value) {
          var d = new Date(fd);
          if(moment(d).isValid()) {
            this.model.set('entry_date', moment(d).format('DD/MM/YYYY'));
          } else {
            return false;
          }
        }, this)
      });
      // let categoriesView = this.getChildView('categories'), self;
    },

    onDomRefresh: function() {},

    onEventSync: function(model) {},

    onEventDelete: function(e) {
      e.preventDefault();
      this.ui.modal.modal('show');
    },

    onEventDeleteAction: function() {
      this.model.destroy({
        success: _.bind(function() {
          this.ui.modal.modal('hide');
          return app.navigate('records');
        }, this)
      });
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
        this.ui[err.field].addClass('has-error');
      }, this);

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
