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
    'datatables.net': './assets/libs/datatables/media/js/jquery.dataTables',
    'datatables.net-bs': './assets/libs/datatables/media/js/dataTables.bootstrap',
    'datatables.net-responsive': './assets/libs/datatables/media/js/responsive.bootstrap',
    'themejs': './assets/js/main',
    'tabdrop': './assets/libs/bootstrap-tabdrop/bootstrap-tabdrop.min',
    'selectize': './assets/libs/selectize/dist/js/standalone/selectize.min',
    'bootstrap-switch': './assets/libs/bootstrap-switch/dist/js/bootstrap-switch.min',
    'bootstrap-select': './assets/libs/bootstrap-select/dist/js/bootstrap-select',
    'bootstrap-validator': './assets/libs/bootstrap-validator/dist/validator',
    'bootstrap-datepicker': './assets/libs/bootstrap-datepicker/dist/js/bootstrap-datepicker',
    'inputNumber': './assets/libs/inputNumber/js/inputNumber'
  },
  shim: {
    tabdrop: {
      deps: ['jquery']
    },
    bootstrap: {
      deps: ['jquery']
    },
    inputNumber: {
      deps: ['jquery']
    },
    themejs: {
      deps: ['tabdrop', 'bootstrap-switch', 'inputNumber', 'selectize']
    },
    datepicker: {
      deps: ['jquery']
    },
    'datatables.net-responsive': {
      deps: ['datatables.net']
    },
    'datatables.net': {
      deps: ['jquery']
    },
    'datatables.net-bs': {
      deps: ['jquery', 'datatables.net']
    },
    'bootstrap-datepicker': {
      deps: ['bootstrap']
    },
    'bootstrap-select': {
      deps: ['bootstrap']
    },
    'bootstrap-switch': {
      deps: ['bootstrap']
    },
    'bootstrap-validator': {
      deps: ['bootstrap']
    }
  },
  waitSeconds: 30
});

requirejs.onError = function(err) {
  // debugger;
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
  'bootstrap',
  'themejs'
], ($, _, Backbone, stickit, config, app, utils) => {

  $.ajaxSetup({
    cache: false,
    beforeSend: function(xhr) {
      var token = localStorage.getItem('token');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    },
    statusCode: {
      401: function(data) {
        if(data && data.responseText) {
          var response = JSON.parse(data.responseText);
          $('#unauthorized').modal('toggle').find('.modal-message').text(response.message);
          return false;
        }
      }
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

  //start the application
  app.start();

});
