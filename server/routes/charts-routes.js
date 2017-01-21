const Controller = require('../controllers/chart-controller');

module.exports = [{
    method: 'GET',
    path: '/chart',
    config: {
      handler: Controller.getData
    }
  }
]
