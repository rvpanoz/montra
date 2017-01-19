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

var app = new require('./controllers/app')(server);

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

  //record routes
  server.route(require('./routes/record-routes'));

  //category routes
  server.route(require('./routes/category-routes'));

  //charts routes
  server.route(require('./routes/charts-routes'));

  //*start the server
  server.start(function (err) {
    if (err) {
      throw new Error(err);
    }
    console.log('Server is running at ' + server.info.host + ":" + server.info.port);
  });

});
