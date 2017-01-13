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
        var token = localStorage.getItem('token');
        var url = utils.decode(actions), opts;

        if(_.isNull(url)) {
          url = {
            cls: 'home'
          }
        }

        if((!token || _.isNull(token)) && ($.inArray(url.cls, app.publicUrls) == -1)) {
          return app.navigate('login');
        } else {
          if(($.inArray(url.cls, app.publicUrls) !== -1)) {
            app.onAppEvent('userstate:change');
          }
        }

        require(["views/" + url.cls], (View) => {
          var params = _.extend(url.params, {});
          app.trigger('app:view_show', View, params);
        });

      } catch (e) {
        throw new Error(e);
      }
    }
  });

});
