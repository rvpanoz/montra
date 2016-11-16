define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  return Marionette.View.extend({
    template: templates.newRecord,
    className: 'container',
    xbindings: {
      '#thot-title': 'title',
      '#thot-situation': 'situation',
      '#thot-emotions': 'emotions',
      '#thot-automatic-thoughts': 'automatic_thoughts',
      '#thot-rational-response': 'rational_response',
      '#thot-additional-notes': 'additional_notes',
    },
    xevents: {
      'click #submit': 'onRecordSave',
      'click .btn-emotion': 'onAddEmotion'
    },
    xui: {
      'emc': '.emotions-container',
      'emi': '#thot-emotions',
      'mrt': '#rate-modal',
      'bsw': '.bsw',
      'infoModal': '#info-modal'
    },
    initialize: function(params) {

    }
  });

});
