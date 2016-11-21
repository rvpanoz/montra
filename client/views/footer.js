define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  var FooterView = Marionette.View.extend({
    className: 'footer',
    initialize: function(params) {
      if(params) {
        switch(params.handler) {
          case 'formHandler':
          this.template = templates.footerForm;
          break;
          case 'listHandler':
          this.template = templates.footerList;
          break;
        }
      }
    }
  });

  return FooterView;
});
