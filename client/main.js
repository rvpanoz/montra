requirejs.config({
  enforceDefine: false,
  urlArgs: '_rq=' + (new Date()).getTime(),
  paths: {
    config: 'config',
    app: 'app',
    datepicker: './plugins/datepicker/js/datepicker',
    nicescroll: './plugins/nicescroll/jquery.nicescroll.min',
    jquery: './bower_components/jquery/dist/jquery',
    underscore: './bower_components/underscore/underscore',
    backbone: './bower_components/backbone/backbone',
    stickit: './bower_components/backbone.stickit/backbone.stickit',
    'backbone.radio': './bower_components/backbone.radio/build/backbone.radio',
    marionette: './bower_components/backbone.marionette/lib/backbone.marionette',
    bootstrap: './bower_components/bootstrap/dist/js/bootstrap',
    bootstrapSwitch: './assets/js/bootstrap-switch',
    moment: './bower_components/moment/min/moment.min',
    tpl: 'tpl'
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
    bootstrap: {
      exports: 'bootstrap',
      deps: ['jquery']
    },
    bootstrapSwitch: {
      exports: 'bootstrapSwitch',
      deps: ['bootstrap']
    },
    datepicker: {
      exports: 'datepicker',
      deps: ['jquery']
    },
    nicescroll: {
      exports: 'nicescroll',
      deps: ['jquery']
    }
  },
  waitSeconds: 30
});

requirejs([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'stickit',
  'config',
  'app',
  'utils',
  'datepicker',
  'nicescroll'
], ($, _, Backbone, bootstrap, stickit, config, app, utils) => {

  $.ajaxSetup({
    cache: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('id_token'));
    }
  });

  $(document).ajaxError(function(e, xhr, options, type) {
    if(type && (type == "Unauthorized" || type == "Bad Request")) {
      return app.navigate('user-signin');
    }
  });

  $(document).ajaxStart(function(){
    $(".loading").css("display", "block");
  });

  $(document).ajaxComplete(function(){
    $(".loading").css("display", "none");
  });

  $(document).ready(function() {
    $("html").niceScroll();
  });

  //start the application
  app.start();

});
