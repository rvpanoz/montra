define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  var HeaderView =  Marionette.View.extend({
    template: templates.header,
    events: {
      'click .signout': 'signout'
    },

    onRender: function() {
      this.$el.attr('id', 'navbar');
    },

    signout: function(e) {
      e.preventDefault();
      localStorage.removeItem('token');
      app.navigate('home');
    }
  });

  return HeaderView;
});
