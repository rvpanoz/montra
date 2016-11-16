/*
* App controller
*/

//imports
const Boom = require('boom');
const _ = require('lodash');
const Category = require('../models/category');

module.exports = function(server) {

  var app = _.extend({}, {

    start: function() {
      console.log('montra start');
    },

    categories: {

      browse: function(reply, opts) {
        Category.find({

        }).lean().exec(function(err, categories) {
          if(err) {
            throw Boom.badRequest(err);
          }

          reply({
            success: true,
            data: categories
          });
        });
      },

      insert: function(reply, data) {

        let category = new Category(data);

        category.save(function(err, new_category) {
          if (err) {
            throw Boom.badRequest(err);
          } else if (category) {
            reply({
              success: true,
              data: new_category
            });
          } else {
            throw Boom.badRequest(err);
          }
        });
      }
    }
  });

  return app;
};
