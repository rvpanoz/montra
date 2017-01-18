const config = require('../config');
const _ = require('lodash');
const async = require('async');
const moment = require('moment');
const Category = require('../models/category');

var CategoryController = _.extend({

  browse: function (uid, reply) {
    Category.find({
      user_id: uid
    }).lean().exec(function (err, categories) {
      if (err) {
        throw Boom.badRequest(err);
      }
      reply({
        success: true,
        data: categories
      });
    });
  },

  insert: function (uid, data, reply) {
    var category = new Category(_.extend(data, {
      user_id: uid
    }));

    category.save(function (err, new_category) {
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

  update: function (uid, id, data, reply) {
    Category.findOne({
      user_id: uid,
      _id: id
    }, function (err, category) {
      if (err) {
        throw Boom.badRequest(err);
      }

      // set new attrs
      category.name = data.name;
      category.color = data.color;
      category.updated_at = moment().toISOString();

      category.save(function (err, updated_category) {
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

  get: function (uid, id, reply) {
    Category.findOne({
      user_id: uid,
      _id: id
    }).exec(function (err, category) {
      if (err) {
        throw Boom.badRequest(err);
      }
      reply({
        success: true,
        data: category
      });
    });
  },

  remove: function (uid, id, reply) {
    Category.findOne({
      user_id: uid,
      _id: id
    }, function (err, category) {
      if (err) {
        throw Boom.badRequest(err);
      }

      category.remove(function (err, removed_category) {
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

})

module.exports = CategoryController;
