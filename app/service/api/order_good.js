const BaseService = require("../base");

class OrderGoodService extends BaseService {
  constructor(app) {
    super("OrderGood", app);
  }
}

module.exports = OrderGoodService;
