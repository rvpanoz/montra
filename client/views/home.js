define([
  'marionette',
  'templates',
  'shepherd'
], function(Marionette, templates, Shepherd) {

  return Marionette.View.extend({
    template: templates.home,
    onAttach: function() {
      
    }
  });

});
