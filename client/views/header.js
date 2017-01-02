define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  var HeaderView =  Marionette.View.extend({
    template: templates.header,
    className: 'navbar navbar-default',

    onRender: function() {
      this.$el.attr('id', 'navbar');
    }
  });
  
  return HeaderView;
});
