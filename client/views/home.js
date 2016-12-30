define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  return Marionette.View.extend({
    className: '.mui-container-fluid',
    template: templates.home
  });

});
