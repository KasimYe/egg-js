const BaseService = require("../base");

class UserCouponService extends BaseService {
  constructor(app) {
    super("UserCoupon", app);
  }
}

module.exports = UserCouponService;
