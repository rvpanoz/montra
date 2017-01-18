const Controller = require('../controllers/category-controller');

module.exports = [{
    method: 'GET',
    path: '/data/categories',
    config: {
      handler: function (req, reply) {
        var params = req.params;
        var uid = req.auth.credentials.id;
        return Controller.browse(uid, reply);
      }
    }
  },
  {
    method: 'POST',
    path: '/data/category',
    config: {
      handler: function (req, reply) {
        var payload = req.payload;
        var uid = req.auth.credentials.id;
        return Controller.insert(uid, payload, reply);
      }
    }
  },
  {
    method: 'PUT',
    path: '/data/category/{id?}',
    config: {
      handler: function (req, reply) {
        var payload = req.payload;
        var id = req.params.id;
        var uid = req.auth.credentials.id;
        return Controller.update(uid, id, payload, reply);
      }
    }
  },
  {
    method: 'DELETE',
    path: '/data/categories/{id}',
    config: {
      handler: function (req, reply) {
        var cid = req.params.id;
        var uid = req.auth.credentials.id;
        return Controller.remove(uid, cid, reply);
      }
    }
  },
  {
    method: 'GET',
    path: '/data/category/{id}',
    config: {
      handler: function (req, reply) {
        var cid = req.params.id;
        var uid = req.auth.credentials.id;
        return Controller.get(uid, cid, reply);
      }
    }
  }
];
