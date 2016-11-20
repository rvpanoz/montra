/*
 * App controller
 */

'use strict';

//imports
const bcrypt = require('bcryptjs');
const Boom = require('boom');
const wlog = require('winston');
const _ = require('lodash');
const createToken = require('../token');
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

        // set user_id
        app.user_id = req.pre.user._id;

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
      browse: function(reply, opts) {
        Record.find({
          user_id: app.user_id
        }).populate('category_id').lean().exec(function(err, records) {
          if (err) {
            throw Boom.badRequest(err);
          }
          reply({
            success: true,
            data: records
          });
        });
      },

      insert: function(reply, attrs) {
        _.extend(attrs, {
          user_id: app.user_id
        });

        let record = new Record(attrs);
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

      get: function(reply, id) {
        Record.findOne({
          user_id: app.user_id,
          _id: id
        }).exec(function(err, record) {
          if (err) {
            throw Boon.badRequest(err);
          }
          reply({
            success: true,
            data: record
          });
        });
      },

      update: function(reply, id, attrs) {
        Record.findById(id, function(err, record) {
          if (err) {
            throw Boon.badRequest(err);
          }

          record.amount = attrs.amount;
          record.entry_date = attrs.entry_date;
          record.kind = attrs.kind;
          record.payment_method = attrs.payment_method;
          record.category_id = attrs.category_id;
          record.notes = attrs.notes;

          record.save(function(err, updated_record) {
            if (err) {
              throw Boon.badImplementation('Record:  Error on updating record', err);
            }
            reply({
              success: true,
              data: updated_record
            })
          });
        });
      },

      remove: function(reply, id) {
        Record.findById(id, function(err, record) {
          if (err) {
            throw Boon.badRequest(err);
          }

          record.remove(function(err, removed_record) {
            if (err) {
              throw Boon.badImplementation('Record:  Error on deleting record', err);
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

      browse: function(reply, opts) {
        Category.find({
          user_id: app.user_id
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

      insert: function(reply, attrs) {
        _.extend(attrs, {
          user_id: app.user_id
        });

        let category = new Category(attrs);
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

      update: function(reply, id, attrs) {
        Category.findById(id, function(err, category) {
          if (err) {
            throw Boon.badRequest(err);
          }

          category.name = attrs.name;
          category.save(function(err, updated_category) {
            if (err) {
              throw Boon.badImplementation('Category:  Error on updating category', err);
            }
            reply({
              success: true,
              data: updated_category
            })
          });
        });
      },

      get: function(reply, id) {
        Category.findOne({
          _id: id,
          user_id: app.user_id
        }).exec(function(err, category) {
          if (err) {
            throw Boon.badRequest(err);
          }
          reply({
            success: true,
            data: category
          });
        });
      },

      remove: function(reply, id) {
        Category.findById(id, function(err, category) {
          if (err) {
            throw Boon.badRequest(err);
          }

          category.remove(function(err, removed_category) {
            if (err) {
              throw Boon.badImplementation('Category:  Error on deleting category', err);
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
