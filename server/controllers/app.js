/*
 * App controller
 */

'use strict';

//imports
const bcrypt = require('bcryptjs');
const Boom = require('boom');
const wlog = require('winston');
const _ = require('lodash');
const async = require('async');
const moment = require('moment');
const createToken = require('../token');
const utils = require('../util');
const User = require('../models/user');

const Category = require('../models/category');
const config = require('../config');

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
            admin: req.pre.user.admin,
            id_token: createToken(req.pre.user)
          }
        });
      },
      insert: function(reply, attrs) {
        var user = new User(attrs);

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
    charts: {
      getMonthlyData: function(uid) {
        //todo..
      }
    }
  });

  return app;
};
