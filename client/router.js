/*app router */

define([
  'backbone',
  'utils'
], (Backbone, utils) => {
  'use strict';

  return Backbone.Router.extend({
    routes: {
      '*actions': 'do_action'
    },
    do_action: function(actions) {
      try {
        var url = utils.decode(actions), opts;

        require(["views/" + url.cls], (View) => {
          var params = url.params
          var view = new View(params);
          app.trigger('app:view_show', view);
        });
      } catch (e) {
        throw new Error(e);
      }
    }
  });

});
