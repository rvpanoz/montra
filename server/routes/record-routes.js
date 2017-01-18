const Controller = require('../controllers/record-controller');

module.exports = [{
    method: 'GET',
    path: '/data/records',
    config: {
      handler: function (req, reply) {
        var uid = req.auth.credentials.id;
        var dataParams = req.query;
        return Controller.browse(uid, reply, dataParams);
      }
    }
  },
  {
    method: 'POST',
    path: '/data/record',
    config: {
      handler: function (req, reply) {
        var payload = req.payload;
        var uid = req.auth.credentials.id;
        return Controller.insert(uid, payload, reply);
      }
    }
  },
  {
    method: 'GET',
    path: '/data/records/{id}',
    config: {
      handler: function (req, reply) {
        var rid = req.params.id;
        var uid = req.auth.credentials.id;
        return Controller.get(uid, rid, reply);
      }
    }
  },
  {
    method: 'PUT',
    path: '/data/records/{id?}',
    config: {
      handler: function (req, reply) {
        var payload = req.payload;
        var id = req.payload._id;
        var uid = req.auth.credentials.id;
        return Controller.update(uid, id, payload, reply);
      }
    }
  },
  {
    method: 'DELETE',
    path: '/data/records/{id}',
    config: {
      handler: function (req, reply) {
        var uid = req.auth.credentials.id;
        var rid = req.params.id;
        return Controller.remove(uid, rid, reply);
      }
    }
  }
];
