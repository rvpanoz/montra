const config = require('../config');
const _ = require('lodash');
const async = require('async');
const moment = require('moment');
const Record = require('../models/record');
const Category = require('../models/category');

var ChartController = _.extend({

  getMonthSumPerYear: function (uid, opts, reply) {
    var year = moment().year();
    reply({
      success: true,
      opts: opts
    });
  }
});

module.exports = ChartController;
