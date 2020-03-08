const BaseService = require("../base");

class UserService extends BaseService {
  constructor(app) {
    super("User", app);
  }
}

module.exports = UserService;
