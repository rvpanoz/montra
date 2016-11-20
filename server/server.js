'use strict';

// imports
const Path = require('path');
const Hapi = require('hapi');
const Wreck = require('wreck');
const Mongoose = require('mongoose');
const Boom = require('boom');
const _ = require('lodash');

const secret = require('./secret');
const config = require('./config');
const verifyCredentials = require('./util').verifyCredentials;
const verifyUniqueUser = require('./util').verifyUniqueUser;

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

server.register(require('hapi-auth-jwt'), (err) => {

  // strategy 'jwt'
  server.auth.strategy('jwt', 'jwt', 'required', {
    key: secret,
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  server.route({
    method: 'POST',
    path: '/user',
    config: {
      auth: false,
      // Before the route handler runs, verify that the user is unique
      pre: [{
        method: verifyUniqueUser
      }],
      handler: (req, reply) => {
        let payload = req.payload;
        return app.users.insert(reply, payload);
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/user/authenticate',
    config: {
      auth: false,
      // Check the user's password against the DB
      pre: [{
        method: verifyCredentials,
        assign: 'user'
      }],
      handler: (req, reply) => {
        return app.users.authenticate(req, reply);
      }
    }
  });

  // application routes
  server.route({
    method: 'POST',
    path: '/data/record',
    config: {
      handler: function(req, reply) {
        var payload = req.payload;
        return app.records.insert(reply, payload);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/data/records/{id}',
    config: {
      handler: function(req, reply) {
        var rid = req.params.id;
        return app.records.get(reply, rid);
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/data/records/{id?}',
    config: {
      handler: function(req, reply) {
        let payload = req.payload;
        return app.records.update(reply, payload._id, payload);
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/data/records/{id}',
    config: {
      handler: function(req, reply) {
        let cid = req.params.id;
        return app.records.remove(reply, cid);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/data/records',
    config: {
      handler: function(req, reply) {
        return app.records.browse(reply, {});
      }
    }
  });

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
    method: 'POST',
    path: '/data/category',
    config: {
      handler: function(req, reply) {
        let payload = req.payload;
        return app.categories.insert(reply, payload);
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/data/category/{id?}',
    config: {
      handler: function(req, reply) {
        let payload = req.payload;
        return app.categories.update(reply, payload._id, {
          name: payload.name
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/data/category/{id}',
    config: {
      handler: function(req, reply) {
        let cid = req.params.id;
        return app.categories.get(reply, cid);
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/data/category/{id}',
    config: {
      handler: function(req, reply) {
        let cid = req.params.id;
        return app.categories.remove(reply, cid);
      }
    }
  });

});


server.start(function(err) {
  if (err) {
    throw new Error(err);
  }
  console.log('Server is running at ' + server.info.host + ":" + server.info.port);
});
