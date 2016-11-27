define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  return Marionette.View.extend({
    template: templates.home,
    events: {
      'click .b': function(e) {
        debugger;
      }
    }
  });

});
