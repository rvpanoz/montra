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
          url = app.homeUrl;
        }


        if((!token || _.isNull(token)) && ($.inArray(url.cls, app.publicUrls) == -1)) {
          url = app.signinUrl;
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
