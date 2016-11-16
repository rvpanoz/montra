define([
  'marionette',
  'schemas/record-schema',
  'templates',
  'moment'
], function (Marionette, RecordSchema, templates, moment) {
  'use strict';

  var RecordDetailView = Marionette.View.extend({
    template: templates.recordDetailView,
    model: new RecordSchema.model(),
    emotionsArr: [],
    modelEvents: {
      'sync': 'onModelSync'
    },
    ui: {
      'emc': '.emotions-container'
    },
    initialize: function (params) {
      _.bindAll(this, 'onModelSync');

      if (params.id) {
        this.model.set('_id', params.id);
        this.model.fetch();
      }
    },
    onModelSync: function () {
      var emotions = this.model.get('emotions'), html = "";
      _.each(emotions, function(emotion, idx) {
        html+="<span class='badge'>" + emotion.name + "</span>"
      }, this);
      this.render();
      this.ui.emc.html(html);
    },
    serializeData: function(){
      var d = this.model.get('created_at');
      return _.extend(this.model.toJSON(), {
        'date_created': moment(d).format('DD/MM/YYYY HH:mm')
      });
    }
  });

  return RecordDetailView;
});
