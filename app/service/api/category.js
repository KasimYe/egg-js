const BaseService = require("../base");

class CategoryService extends BaseService {
  constructor(app) {
    super("Category", app);
  }
}

module.exports = CategoryService;
