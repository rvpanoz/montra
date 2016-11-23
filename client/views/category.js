define([
  'marionette',
  'schemas/category-schema',
  'templates'
], function(Marionette, CategorySchema, templates) {

  var CategoryView = Marionette.View.extend({
    template: templates.category,
    bindings: {
      '#input-name': 'name'
    },
    ui: {
      actions: 'div.form-actions',
      name: 'div.input-name',
      modal: '.modal'
    },
    modelEvents: {
      'sync': 'onEventSync'
    },
    events: {
      'click #btn-delete': 'onEventDelete',
      'click #btn-ok': '_onEventDeleteAction',
      'click .btn-save': 'onEventSave',
      'click .btn-back': 'onEventBack'
    },
    initialize: function(params) {
      this.model = new CategorySchema.model();
      if (params.id) {
        this.model.set('_id', params.id);
        this.model.fetch();
      }
      this.listenTo(this.model, 'invalid', this.onValidationError, this);
      // CategoryView.__super__.initialize.call(this, arguments);
    },

    onRender: function() {
      this.stickit();
    },

    onAttach: function() {},

    onEventSync: function(model) {
      console.log('model synced');
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
      app.navigate('categories');
      return false;
    },

    onEventDelete: function(e) {
      e.preventDefault();
      this.ui.modal.modal('show');
    },

    _onEventDeleteAction: function() {
      this.model.destroy({
        success: _.bind(function() {
          this.ui.modal.modal('hide');
          return app.navigate('categories');
        }, this)
      });
    },

    onValidationError: function(model) {
      var errors = model.validationError;
      _.each(errors, function(err) {
        this.ui[err.field].addClass('has-error');
      }, this);
    },

    onBack: function(e) {
      if(e) {
        e.preventDefault();
      }
      app.navigate('categories');
      return false;
    },
    serializeData: function() {
      return {
        items: {
          isNew: this.model.isNew(),
          title: (this.model.isNew()) ? 'New category' : 'Edit category'
        }
      }
    }
  });

  return CategoryView;
});
