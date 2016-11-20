define([
  'marionette',
  'schemas/record-schema',
  'templates',
  'moment'
], function (Marionette, RecordSchema, templates, moment) {
  'use strict';

  var RecordView = Marionette.View.extend({
    template: templates.recordDetailView,
    modelEvents: {
      'sync': '_render'
    },
    events: {
      'click .btn-update': 'onEventUpdate',
      'click .btn-delete': 'onEventDelete'
    },
    initialize: function (params) {
      _.bindAll(this, '_render');
      this.model = new RecordSchema.model();

      if (params.id) {
        this.model.set('_id', params.id);
        this.model.fetch();
      }
    },
    _render: function () {
      this.render();
    },
    onEventUpdate: function(e) {
      e.preventDefault();
      app.navigate('record', {
        id: this.model.get('_id')
      });
    },
    onEventDelete: function(e) {
      e.preventDefault();
      this.model.destroy({
        success: _.bind(function(removed_category) {
          app.navigate('records');
          return false;
        })
      });
    },
    serializeData: function(){
      var d = this.model.get('created_at');
      return _.extend(this.model.toJSON(), {
        'date_created': moment(d).format('DD/MM/YYYY HH:mm')
      });
    }
  });

  return RecordView;
});
