define([
  'marionette',
  'schemas/category-schema',
  'templates'
], function(Marionette, CategorySchema, templates) {

  var CategoryView = Marionette.View.extend({
    template: templates.category,
    className: 'category-form',
    bindings: {
      '#input-name': 'name'
    },
    ui: {
      name: 'div.input-name'
    },
    modelEvents: {
      // 'sync': 'onEventSync',
      'change': 'onModelChange'
    },
    events: {
      'click .save': 'onEventSave',
      'click .back': 'onEventBack'
    },

    initialize: function(params) {
      this.model = new CategorySchema.model();

      if (params.id) {
        this.model.set('_id', params.id);
        this.model.fetch();
      }

      this.listenTo(this.model, 'invalid', this.onValidationError, this);
    },

    onRender: function() {
      this.stickit();
    },

    onEventSave: function(e) {
      if(e) {
        e.preventDefault();
      }
      this.model.save(null, {
        success: _.bind(this.onEventSaveCallback, this)
      });
    },

    onModelChange: function(model) {
      for(var z in model.changed) {
        var element = this.$('.mdl-' + z);
        if(element.length) {
          element.addClass('is-focused');
        }
      }
    },

    onEventSaveCallback: function(model) {
      app.navigate('categories');
      return false;
    },

    onValidationError: function(model) {
      var errors = model.validationError;
      console.log(errors);
      return _.isEmpty(errors) ? void 0 : errors;
    },

    onEventBack: function(e) {
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
