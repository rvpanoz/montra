'use strict';

// imports
const Path = require('path');
const Hapi = require('hapi');
const Wreck = require('wreck');
const Mongoose = require('mongoose');
const Boom = require('boom');
const _ = require('lodash');

let config = require('./config');

// database connection
Mongoose.connect(config.mongoConString);

// use bluebird Promises Library
Mongoose.Promise = require('bluebird');

// hapi server instance
var server = new Hapi.Server({
  connections: {
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  }
});

// server connection
server.connection({
  port: config.port,
});

// application base controller
let app = new require('./controllers/app-controller')(server);

// application routes
server.route({
  method: 'GET',
  path: '/data/categories',
  config: {
    handler: function(req, reply) {
      let params = req.params;
      return app.categories.browse(reply, {
        limit: 'all',
        populate: false
      });
    }
  }
});

server.route({
  method: 'GET',
  path: '/data/categories/add/{name}',
  config: {
    handler: function(req, reply) {
      let params = req.params;
      return app.categories.insert(reply, {
        name: params.name || 'New category'
      });
    }
  }
});


server.start(function(err) {
  if (err) {
    throw new Error(err);
  }
  console.log('Server is running at ' + server.info.host + ":" + server.info.port);
});
