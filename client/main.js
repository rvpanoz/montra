requirejs.config({
  enforceDefine: false,
  urlArgs: '_rq=' + (new Date()).getTime(),
  paths: {
    config: 'config',
    app: 'app',
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
  'utils'
], ($, _, Backbone, bootstrap, stickit, config, app, utils) => {

  //start the application
  app.start();
});
