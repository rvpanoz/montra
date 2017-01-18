const config = require('../config');
const _ = require('lodash');
const utils = require('../util');
const async = require('async');
const moment = require('moment');
const Record = require('../models/record');

var RecordController = _.extend({
  browse: function (uid, reply, dataParams) {
    function str2bool(strvalue) {
      var ret;
      if (strvalue && typeof strvalue == 'string') {
        return (strvalue.toLowerCase() == 'false' || strvalue == '0') ? false : true;
      }
    }

    var query = _.extend({}, {
        user_id: uid
      }),
      q = {};

    if (!dataParams) {
      _.extend(query, {
        entry_date: {
          '$gte': moment().startOf('month').toISOString(),
          '$lte': moment().endOf('month').toISOString()
        }
      });
    } else {

      /** category_id filter **/
      var category_id = _.get(dataParams, 'input-category');
      if (str2bool(category_id)) {
        _.extend(query, {
          category_id: category_id
        })
      }

      /** kind filter **/
      var kind = _.get(dataParams, 'input-kind');
      if (str2bool(kind)) {
        _.extend(query, {
          kind: kind
        });
      }

      /** payment_method filter **/
      var payment_method = _.get(dataParams, 'input-payment');
      if (str2bool(payment_method)) {
        _.extend(query, {
          payment_method: payment_method
        });
      }

      if (_.has(dataParams, 'input-entry-date-from')) {
        var edf = moment(new Date(_.get(dataParams, 'input-entry-date-from')));
      }

      if (_.has(dataParams, 'input-entry-date-to')) {
        var edt = moment(new Date(_.get(dataParams, 'input-entry-date-to')));
      }

      if ((edf && edf.isValid()) && (edt && edt.isValid())) {
        _.extend(query, {
          entry_date: {
            '$gte': (edf) ? edf.toISOString() : moment().startOf('month').toISOString(),
            '$lte': (edt) ? edt.toISOString() : moment().endOf('month').toISOString()
          }
        });
      }

      if (!_.has(query, 'entry_date')) {
        _.extend(query, {
          entry_date: {
            '$gte': moment().startOf('month').toISOString(),
            '$lte': moment().endOf('month').toISOString()
          }
        });
      }
    }

    var options = {
      sort: {
        entry_date: -1
      },
      populate: 'category_id',
      lean: true,
      page: (dataParams && dataParams.page) ? dataParams.page : 1,
      limit: config.perPage
    };

    var countQuery = function (callback) {
      Record.find(query).populate('category_id').exec(function (err, allRecords) {
        if (err) throw new Error(err);
        callback(null, allRecords);
      });
    };

    var retrieveQuery = function (callback) {
      Record.paginate(query, options, function (err, records) {
        if (err) {
          throw new Error(err);
        }
        callback(null, records);
      });
    };

    /** run in parallel **/
    async.parallel([countQuery, retrieveQuery], function (err, results) {
      reply({
        success: true,
        data: results[1].docs,
        total: results[1].total,
        pages: results[1].pages,
        page: results[1].page,
        allData: results[0]
      });
    });
  },

  insert: function(uid, data, reply) {

    //fix date for mongodb
    var dateString = data.entry_date;
    var parts = dateString.split('/');
    var day = parts[0];
    var month = parts[1];
    var year = parts[2];

    var fd = moment(utils.stringToDate(dateString, "dd/MM/yyyy", "/"));

    if (fd.isValid()) {
      data.entry_date = fd.toISOString();
    } else {
      throw Boom.badRequest('Record: Invalid entry date');
    }

    var record = new Record(_.extend(data, {
      user_id: uid
    }));

    record.save(function(err, new_record) {
      if (err) {
        reply({
          success: false,
          data: [],
          error: err
        });
      } else if (new_record) {
        reply({
          success: true,
          data: new_record
        });
      } else {
        throw Boom.badRequest(err);
      }
    });
  },

  get: function(uid, id, reply) {
    Record.findOne({
      user_id: uid,
      _id: id
    }).exec(function(err, record) {
      if (err) {
        throw Boom.badRequest(err);
      }
      reply({
        success: true,
        data: record
      });
    });
  },

  update: function(uid, id, data, reply) {
    Record.findOne({
      user_id: uid,
      _id: id
    }, function(err, record) {
      if (err) {
        throw Boom.badRequest(err);
      }

      //fix date for mongodb
      var dateString = data.entry_date;
      var parts = dateString.split('/');
      var day = parts[0];
      var month = parts[1];
      var year = parts[2];

      var fd = moment(utils.stringToDate(dateString, "dd/MM/yyyy", "/"));

      if (fd.isValid()) {
        data.entry_date = fd.toISOString();
      } else {
        throw Boom.badRequest('Record: Invalid entry date');
      }

      record.amount = data.amount;
      record.entry_date = data.entry_date;
      record.kind = data.kind;
      record.payment_method = data.payment_method;
      record.category_id = data.category_id;
      record.notes = data.notes;

      record.save(function(err, updated_record) {
        if (err) {
          throw Boom.badImplementation('Record:  Error on updating record', err);
        }
        reply({
          success: true,
          data: updated_record
        })
      });
    });
  },

  remove: function(uid, rid, reply) {
    Record.findById(rid, function(err, record) {
      if (err) {
        throw Boom.badRequest(err);
      }

      record.remove(function(err, removed_record) {
        if (err) {
          throw Boom.badImplementation('Record:  Error on deleting record', err);
        }
        reply({
          success: true,
          data: removed_record
        })
      });
    });
  }

})

module.exports = RecordController;
