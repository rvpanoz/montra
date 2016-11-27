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
    avgrund: './plugins/avgrund/jquery.avgrund.min'
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
    avgrund: {
      exports: '$.fn.avgrund',
      deps: ['jquery']
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
  'datepicker',
  'avgrund'
], ($, _, Backbone, stickit, config, app, utils) => {

  $.ajaxSetup({
    cache: false,
    beforeSend: function(xhr) {
      var token = localStorage.getItem('token');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  });

  $(document).ajaxError(function(e, xhr, options, type) {
    if(type && (type == "Unauthorized")) {
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
    componentHandler.upgradeDom();
  });

  //start the application
  app.start();

});
