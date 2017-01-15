define([
  'marionette',
  'schemas/category-schema',
  'templates',
  'bootstrapColorpicker'
], function(Marionette, CategorySchema, templates) {

  var CategoryView = Marionette.View.extend({
    template: templates.category,
    className: 'category-form',
    bindings: {
      '#input-name': 'name',
      '#colorpickerr': 'color'
    },
    ui: {
      name: '#input-name',
      colorpicker: '#colorpicker'
    },
    modelEvents: {
      'sync': 'render',
      'change': 'onModelChange'
    },
    events: {
      'click .save': 'onSave',
      'click .cancel': 'onBack'
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
      var color = this.model.get('color');
      this.ui.colorpicker.colorpicker({
        color: (_.isNull(color) ? '#AA3399' : color),
        format: 'hex'
      });
      this.ui.colorpicker.bind('changeColor', _.bind(function(e) {
        var value = this.ui.colorpicker.colorpicker('getValue');
        if(value != false) {
          this.model.set('color', value);
        }
      }, this));

    },

    onSave: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.model.save(null, {
        success: _.bind(this.onEventSaveCallback, this)
      });
    },

    onModelChange: function(model) {
      // console.log(model.toJSON());
    },

    onEventSaveCallback: function(model) {
      app.navigate('categories/categories');
      return false;
    },

    onValidationError: function(model) {
      var errors = model.validationError;
      return _.isEmpty(errors) ? void 0 : errors;
    },

    onBack: function(e) {
      if (e) {
        e.preventDefault();
      }
      app.navigate('categories/categories');
      return false;
    },

    serializeData: function() {
      return {
        title: (this.model.isNew()) ? 'New category' : 'Edit category'
      }
    }
  });

  return CategoryView;
});
