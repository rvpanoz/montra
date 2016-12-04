/*
 * App controller
 */

'use strict';

//imports
const bcrypt = require('bcryptjs');
const Boom = require('boom');
const wlog = require('winston');
const _ = require('lodash');
const moment = require('moment');
const createToken = require('../token');
const utils = require('../util');
const User = require('../models/user');
const Record = require('../models/record');
const Category = require('../models/category');

//set log level
wlog.level = 'debug';

function hashPassword(password, cb) {
  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash);
    });
  });
}

module.exports = function(server) {

  var app = _.extend({}, {

    user_id: null,

    users: {
      authenticate: function(req, reply) {
        // If the user's password is correct, we can issue a token.
        // If it was incorrect, the error will bubble up from the pre method
        reply({
          success: true,
          data: {
            id_token: createToken(req.pre.user)
          }
        });
      },
      insert: function(reply, attrs) {
        let user = new User(attrs);
        user.admin = false;

        hashPassword(attrs.password, (err, hash) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          user.password = hash;
          user.save((err, new_user) => {
            if (err) {
              throw Boom.badRequest(err);
            }
            // If the user is saved successfully, issue a JWT
            reply({
              success: true,
              data: {
                id_token: createToken(new_user)
              }
            });
          });
        });
      }
    },

    records: {
      browse: function(uid, reply, dataParams) {
        function str2bool(strvalue){
          var ret;
          if(strvalue && typeof strvalue == 'string') {
            return (strvalue.toLowerCase() == 'false' || strvalue == '0') ? false : true;
          }
        }

        var params = _.extend({}, {
          user_id: uid
        });
        var q = {};

        if (dataParams) {

          if(dataParams['input-category']) {
            var categoryId = dataParams['input-category'];
            if(str2bool(categoryId) == true) {
              _.extend(params, {
                category_id: dataParams['input-category'],
              });
            }
          }

          if(dataParams['input-payment-method']) {
            _.extend(params, {
              payment_method: dataParams['input-payment-method'],
            });
          }

          if(dataParams['input-kind']) {
            _.extend(params, {
              kind: dataParams['input-kind'],
            });
          }

          if(_.has(dataParams, 'input-entry-date-from')) {
            var edf = moment(new Date(dataParams['input-entry-date-from']));
          }

          if(_.has(dataParams, 'input-entry-date-to')) {
            var edt = moment(new Date(dataParams['input-entry-date-to']));
          }

          if ((edf && edf.isValid()) && (edt && edt.isValid())) {
            _.extend(params, {
              entry_date: {
                '$gte': (edf) ? edf.toISOString() : moment().startOf('month').toISOString(),
                '$lte': (edt) ? edt.toISOString() : moment().endOf('month').toISOString()
              }
            });
          }
        }

        if(!_.has(params, 'entry_date')) {
          _.extend(params, {
            entry_date: {
              '$gt': moment().startOf('month').toISOString(),
              '$lte': moment().endOf('month').toISOString()
            }
          });
        }

        Record.find(params).populate('category_id').lean().exec(function(err, records) {
          if (err) {
            throw Boom.badRequest(err);
          }
          reply({
            success: true,
            data: records
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

        var fd = moment(utils.stringToDate(dateString,"dd/MM/yyyy","/"));

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

          var fd = moment(utils.stringToDate(dateString,"dd/MM/yyyy","/"));

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

    },

    categories: {
      browse: function(uid, reply) {
        Category.find({
          user_id: uid
        }).lean().exec(function(err, categories) {
          if (err) {
            throw Boom.badRequest(err);
          }
          reply({
            success: true,
            data: categories
          });
        });
      },

      insert: function(uid, data, reply) {
        // set user_id
        let category = new Category(_.extend(data, {
          user_id: uid
        }));

        category.save(function(err, new_category) {
          if (err) {
            reply({
              success: false,
              data: [],
              error: err
            });
          } else if (new_category) {
            reply({
              success: true,
              data: new_category
            });
          } else {
            throw Boom.badRequest(err);
          }
        });
      },

      update: function(uid, id, data, reply) {
        Category.findOne({
          user_id: uid,
          _id: id
        }, function(err, category) {
          if (err) {
            throw Boom.badRequest(err);
          }

          // set new attrs
          category.name = data.name;
          category.updated_at = moment().toISOString();

          category.save(function(err, updated_category) {
            if (err) {
              throw Boom.badImplementation('Category:  Error on updating category', err);
            }
            reply({
              success: true,
              data: updated_category
            })
          });
        });
      },

      get: function(uid, id, reply) {
        Category.findOne({
          user_id: uid,
          _id: id
        }).exec(function(err, category) {
          if (err) {
            throw Boom.badRequest(err);
          }
          reply({
            success: true,
            data: category
          });
        });
      },

      remove: function(uid, id, reply) {
        Category.findOne({
          user_id: uid,
          _id: id
        }, function(err, category) {
          if (err) {
            throw Boom.badRequest(err);
          }

          category.remove(function(err, removed_category) {
            if (err) {
              throw Boom.badImplementation('Category:  Error on deleting category', err);
            }
            reply({
              success: true,
              data: removed_category
            })
          });
        });
      }

    }
  });

  return app;
};
