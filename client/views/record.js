define([
  'marionette',
  'schemas/record-schema',
  'views/microviews/categories-select',
  'templates',
  'moment'
], function(Marionette, RecordSchema, CategorySelectView, templates, moment) {

  return Marionette.View.extend({
    type: 'formHandler',
    template: templates.record,
    className: 'container',
    regions: {
      categories: '.categories-select'
    },
    bindings: {
      '#input-amount': {
        observe: 'amount'
      },
      '#payment-method-cash': {
        observe: 'payment_method',
        onSet: function(value) {
          return parseInt(value);
        }
      },
      '#payment-method-card': {
        observe: 'payment_method',
        onSet: function(value) {
          return parseInt(value);
        }
      },
      '#input-kind': 'kind',
      '#input-entry-date': {
        observe: 'entry_date'
      },
      '#input-category': {
        observe: 'category_id',
        onSet: function() {
          var value = $('#input-category').val();
          return value;
        }
      },
      '#kind-income': {
        observe: 'kind',
        onSet: function(value) {
          return parseInt(value);
        }
      },
      '#kind-expense': {
        observe: 'kind',
        onSet: function(value) {
          return parseInt(value);
        }
      },
      '#input-notes': 'notes'
    },
    modelEvents: {
      'sync': 'onEventSync'
    },
    events: {
      'click #btn-delete': 'onEventDelete',
      'click #btn-ok': '_onEventDeleteAction'
    },
    ui: {
      actions: 'div.form-actions',
      amount: 'div.input-amount',
      category_id: 'div.input-category',
      entry_date: 'div.input-entry-date',
      modal: '.modal'
    },

    initialize: function(params) {
      this.model = new RecordSchema.model();

      if (params.id) {
        this.model.set('_id', params.id);
        this.model.fetch();
      }
      this.listenTo(this.model, 'invalid', this.onValidationError, this);
      this.listenTo(app, 'form:save', this.onEventSave, this);
    },

    onRender: function() {
      this.showChildView('categories', new CategorySelectView());
      this.stickit();
    },

    onAttach: function() {
      let categoriesView = this.getChildView('categories'), self;
      $('#input-entry-date').datepicker({
        onSelect: _.bind(function(fd, value) {
          var d = new Date(fd);
          if(moment(d).isValid()) {
            this.model.set('entry_date', moment(d).format('DD/MM/YYYY'));
          } else {
            return false;
          }
        }, this)
      });
    },

    onDomRefresh: function() {},

    onEventDelete: function(e) {
      e.preventDefault();
      this.ui.modal.modal('show');
    },

    _onEventDeleteAction: function() {
      this.model.destroy({
        success: _.bind(function() {
          this.ui.modal.modal('hide');
          return app.navigate('records');
        }, this)
      });
    },

    onEventSync: function(model) {},

    onEventSave: function(e) {
      if(e) {
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
      _.each(errors, function(err) {
        this.ui[err.field].addClass('has-error');
      }, this);

      return _.isEmpty(errors) ? void 0 : errors;
    },

    onBack: function(e) {
      if(e)
        e.preventDefault();
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
