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
    marionette: './bower_components/backbone.marionette/lib/backbone.marionette',
    moment: './bower_components/moment/min/moment.min',
    chartjs: './bower_components/chart.js/dist/Chart.min',
    tpl: 'tpl',
    'backbone.radio': './bower_components/backbone.radio/build/backbone.radio',
    'bootstrapColorpicker': './bower_components/bootstrap-colorpicker/dist/js/bootstrap-colorpicker',
    'bootstrap': './assets/libs/bootstrap/js/bootstrap.min',
    'bootstrap-switch': './assets/libs/bootstrap-switch/dist/js/bootstrap-switch.min',
    'theme': './assets/js/main',
    'scrollbar': './assets/libs/jquery.scrollbar/jquery.scrollbar.min',
    'tabdrop': './assets/libs/bootstrap-tabdrop/bootstrap-tabdrop.min',
    'ionrangeslider': './assets/libs/ionrangeslider/js/ion.rangeSlider.min',
    'sparkline': './assets/libs/sparkline/jquery.sparkline.min',
    'inputNumber': './assets/libs/inputNumber/js/inputNumber',
    'bootstrapSelect': './bower_components/bootstrap-select/dist/js/bootstrap-select'
  },
  shim: {
    inputNumber: {
      deps: ['jquery']
    },
    ionrangeslider: {
      deps: ['jquery']
    },
    'bootstrap-switch': {
      deps: ['jquery']
    },
    tabdrop: {
      deps: ['jquery']
    },
    scrollbar: {
      deps: ['jquery']
    },
    theme: {
      deps: ['scrollbar', 'tabdrop']
    },
    bootstrapSelect: {
      deps: ['bootstrap']
    },
    bootstrap: {
      deps: ['jquery']
    },
    bootstrapColorpicker: {
      deps: ['jquery', 'bootstrap']
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
    sparkline: {
      deps: ['jquery']
    }
  },
  waitSeconds: 30
});

requirejs.onError = function(err) {
  if (err.requireType === 'timeout') {
    console.log('modules: ' + err.requireModules);
  }

  throw new Error(err);
};

requirejs([
  'jquery',
  'underscore',
  'backbone',
  'stickit',
  'config',
  'app',
  'utils',
  'theme',
  'bootstrap',
  'bootstrapSelect',
  'inputNumber',
  'sparkline',
  'ionrangeslider',
  'bootstrap-switch',
  'datepicker'
], ($, _, Backbone, stickit, config, app, utils) => {

  $.ajaxSetup({
    cache: false,
    beforeSend: function(xhr) {
      var token = localStorage.getItem('token');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  });

  $(document).ajaxError(function(e, xhr, options, type) {
    if (type && (type == "Unauthorized")) {
      app.triggerMethod('app:signout');
    }
  });

  $(document).ajaxStart(function() {
    app.wait(true);
  });

  $(document).ajaxComplete(function() {
    app.wait(false);
  });

  // $(document).ready(function() {
  //
  // });

  //start the application
  app.start();

});
