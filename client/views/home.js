define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  return Marionette.View.extend({
    template: templates.home,
    className: 'container'
  });

});
