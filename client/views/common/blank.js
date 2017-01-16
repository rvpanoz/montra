define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  'use strict';

  var BlankView = Marionette.View.extend({
    template: templates.blank,
    serializeData: function() {
      return {
        title: 'No data'
      }
    }
  });

  return BlankView;
});
