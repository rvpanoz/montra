define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  var FooterView = Marionette.View.extend({
    className: 'footer'
  });

  return FooterView;
});
