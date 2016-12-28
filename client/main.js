requirejs.config({
  enforceDefine: false,
  urlArgs: '_rq=' + (new Date()).getTime(),
  paths: {
    config: 'config',
    app: 'app',
    datepicker: './plugins/datepicker/js/datepicker',
    jquery: './bower_components/jquery/dist/jquery',
    underscore: './bower_components/underscore/underscore',
    backbone: './bower_components/backbone/backbone',
    stickit: './bower_components/backbone.stickit/backbone.stickit',
    'backbone.radio': './bower_components/backbone.radio/build/backbone.radio',
    marionette: './bower_components/backbone.marionette/lib/backbone.marionette',
    moment: './bower_components/moment/min/moment.min',
    tpl: 'tpl',
    tether: './bower_components/tether/dist/js/tether',
    shepherd: './bower_components/tether-shepherd/dist/js/shepherd'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    backbone: {
      exports: 'backbone',
      deps: ['jquery', 'underscore']
    },
    stickit: {
      exports: 'stickit',
      deps: ['backbone']
    },
    datepicker: {
      exports: 'datepicker',
      deps: ['jquery']
    },
    tether: {
      exports: 'tether',
      deps: ['jquery']
    },
    shepherd: {
      exports: 'shepherd',
      deps: ['tether']
    }
  },
  waitSeconds: 30
});

requirejs([
  'jquery',
  'underscore',
  'backbone',
  'stickit',
  'config',
  'app',
  'utils',
  'shepherd',
  'datepicker'
], ($, _, Backbone, stickit, config, app, utils, Shepherd) => {

  $.ajaxSetup({
    cache: false,
    beforeSend: function(xhr) {
      var token = localStorage.getItem('token');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  });

  $(document).ajaxError(function(e, xhr, options, type) {
    if (type && (type == "Unauthorized")) {
      return app.navigate('user-signin');
    }
  });

  $(document).ajaxStart(function() {
    app.wait(true);
  });

  $(document).ajaxComplete(function() {
    app.wait(false);
  });

  $(document).ready(function() {
    componentHandler.upgradeDom();

    var tour = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows'
      }
    });

    tour.addStep('add_category', {
      title: 'Welcome',
      text: 'In order to create records you have to create your categories first',
      attachTo: '.step1 right',
      buttons: [
        {
          text: 'Close',
          action: tour.next
        }
      ]
    });

    tour.start();

  });

  //start the application
  app.start();

});
