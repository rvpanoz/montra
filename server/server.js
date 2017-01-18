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

// enable debug mode - log queries to the console
Mongoose.set('debug', config.mongoDebug);
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
        var payload = req.payload;
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
        var uid = req.auth.credentials.id;
        return app.records.insert(uid, payload, reply);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/data/records/{id}',
    config: {
      handler: function(req, reply) {
        var rid = req.params.id;
        var uid = req.auth.credentials.id;
        return app.records.get(uid, rid, reply);
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/data/records/{id?}',
    config: {
      handler: function(req, reply) {
        var payload = req.payload;
        var id = req.payload._id;
        var uid = req.auth.credentials.id;
        return app.records.update(uid, id, payload, reply);
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/data/records/{id}',
    config: {
      handler: function(req, reply) {
        var uid = req.auth.credentials.id;
        var rid = req.params.id;
        return app.records.remove(uid, rid, reply);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/data/records',
    config: {
      handler: function(req, reply) {
        var uid = req.auth.credentials.id;
        var dataParams = req.query;
        return app.records.browse(uid, reply, dataParams);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/data/categories',
    config: {
      handler: function(req, reply) {
        var params = req.params;
        var uid = req.auth.credentials.id;
        return app.categories.browse(uid, reply);
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/data/category',
    config: {
      handler: function(req, reply) {
        var payload = req.payload;
        var uid = req.auth.credentials.id;
        return app.categories.insert(uid, payload, reply);
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/data/category/{id?}',
    config: {
      handler: function(req, reply) {
        var payload = req.payload;
        var id = req.params.id;
        var uid = req.auth.credentials.id;
        return app.categories.update(uid, id, payload, reply);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/data/category/{id}',
    config: {
      handler: function(req, reply) {
        var cid = req.params.id;
        var uid = req.auth.credentials.id;
        return app.categories.get(uid, cid, reply);
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/data/category/{id}',
    config: {
      handler: function(req, reply) {
        var cid = req.params.id;
        var uid = req.auth.credentials.id;
        return app.categories.remove(uid, cid, reply);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/charts/piechart',
    config: {
      handler: function(req, reply) {
        var uid = req.auth.credentials.id;
        return app.charts.piechart(uid, reply);
      }
    }
  });

  var app = new require('./controllers/app-controller')(server);
  
  //*start the server
  server.start(function(err) {
    if (err) {
      throw new Error(err);
    }
    console.log('Server is running at ' + server.info.host + ":" + server.info.port);
  });

});

