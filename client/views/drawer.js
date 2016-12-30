define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  var DrawerView = Marionette.View.extend({
    className: 'mdl-layout__drawer',
    template: templates.drawer
  });

  return DrawerView;
});
