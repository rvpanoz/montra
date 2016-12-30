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
    datepicker: {
      exports: 'datepicker',
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

  $(document).ready(function() {
    componentHandler.upgradeDom();

    var $bodyEl = $('body'),
      $sidedrawerEl = $('#sidedrawer');


    function showSidedrawer() {
      // show overlay
      var options = {
        onclose: function() {
          $sidedrawerEl
            .removeClass('active')
            .appendTo(document.body);
        }
      };

      var $overlayEl = $(mui.overlay('on', options));

      // show element
      $sidedrawerEl.appendTo($overlayEl);
      setTimeout(function() {
        $sidedrawerEl.addClass('active');
      }, 20);
    }


    function hideSidedrawer() {
      $bodyEl.toggleClass('hide-sidedrawer');
    }


    $('.js-show-sidedrawer').on('click', showSidedrawer);
    $('.js-hide-sidedrawer').on('click', hideSidedrawer);

    var $titleEls = $('strong', $sidedrawerEl);

    $titleEls
      .next()
      .hide();

    $titleEls.on('click', function() {
      $(this).next().slideToggle(200);
    });

  });

  //start the application
  app.start();

});
