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

        //authenticate
        var id_token = localStorage.getItem('id_token');
        if(!id_token && ($.inArray(url.cls, app.publicUrls) == -1)) {
          url = app.signinUrl;
          app.showModal();
        } else {
          if(_.isNull(url)) {
            url = app.homeUrl;
          }
        }

        require(["views/" + url.cls], (View) => {
          var params = _.extend(url.params, {});
          var view = new View(params);
          app.trigger('app:view_show', view);
        });

      } catch (e) {
        throw new Error(e);
      }
    }
  });

});
