define([
  'marionette',
  'templates'
], function(Marionette, templates) {
  "use strict";

  var SidebarView =  Marionette.View.extend({
    template: templates.sidebar,
    className: 'sidebar',
    events: {
      'click a.navigation-link': 'onNavigate',
      'click a.signout': 'onSignout'
    },

    initialize: function() {
      this.listenTo(app, "sidebar:switch", _.bind(function(sectionClass) {
        var section = this.$('.' + sectionClass);
        if(section.length) {
          this.quickmenu(section, sectionClass);
        }
      }, this));
    },

    /** copy from assets/js/main.js **/
    quickmenu: function(item, cls) {
      if(item.hasClass('active')) {
        return;
      }
      var menu = this.$('.sidebar__menu');
      menu.removeClass('active').eq(item.index()).addClass('active');
      this.$('.quickmenu__item').removeClass('active');
      this.$('.for-' + cls).addClass('active');
      item.addClass('active');
      menu.eq(0).css('margin-left', '-'+item.index()*200+'px');
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

    onSignout: function(e) {
      if (e) {
        e.preventDefault();
      }
      app.trigger('app:signout');
      return false;
    }
  });

  return SidebarView;
});
