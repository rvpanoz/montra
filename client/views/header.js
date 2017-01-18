define([
  'marionette',
  'templates'
], function(Marionette, templates) {

  var HeaderView =  Marionette.View.extend({
    template: templates.header,
    events: {
      'click a.navigation-link': 'onNavigate',
      'click a.signout': 'signout'
    },
    onNavigate: function(e) {
      e.preventDefault();
      var second_nav = $(this).find('.collapse').first();
      if (second_nav.length) {
        second_nav.collapse('toggle');
        $(this).toggleClass('opened');
      }
      var cls = this.$(e.currentTarget).data('cls');
      if(cls) {
        app.navigate(cls);
      }
      return false;
    },
    signout: function(e) {
      e.preventDefault();
      localStorage.removeItem('token');
      app.navigate('login');
      return false;
    }
  });

  return HeaderView;
});
