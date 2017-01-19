const Controller = require('../controllers/chart-controller');

module.exports = [{
    method: 'GET',
    path: '/chart/sum',
    config: {
      handler: function (req, reply) {
        var params = req.params;

        var uid = req.auth.credentials.id;
        return Controller.getMonthSumPerYear(uid, params, reply);
      }
    }
  }
]
